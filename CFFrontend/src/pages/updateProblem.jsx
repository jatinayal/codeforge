import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Code, FileText, ChevronDown, ChevronUp, Loader } from 'lucide-react';

// Define the schema for validation
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(z.object({
    input: z.string().min(1, 'Input is required'),
    output: z.string().min(1, 'Output is required'),
    explanation: z.string().min(1, 'Explanation is required')
  })).min(1, 'At least one visible test case is required'),
  hiddenTestCases: z.array(z.object({
    input: z.string().min(1, 'Input is required'),
    output: z.string().min(1, 'Output is required')
  })).min(1, 'At least one hidden test case is required'),
  startCode: z.array(z.object({
    language: z.string(),
    initialCode: z.string().min(1, 'Initial code is required')
  })),
  referenceSolution: z.array(z.object({
    language: z.string(),
    completeCode: z.string().min(1, 'Complete code is required')
  }))
});

function UpdateProblem() {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState('basic');
  const [error, setError] = useState('');

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: [
        { language: 'cpp', initialCode: '' },
        { language: 'java', initialCode: '' },
        { language: 'javascript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'cpp', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'javascript', completeCode: '' }
      ]
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setIsLoading(true);
        // Fixed the API endpoint to match server expectations
        const response = await axiosClient.get(`/problem/problembyid/${id}`);
        const problem = response.data;
        
        // Set form values with fetched problem data
        reset({
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          tags: problem.tags,
          visibleTestCases: problem.visibleTestCases,
          hiddenTestCases: problem.hiddenTestCases,
          startCode: problem.startCode,
          referenceSolution: problem.referenceSolution
        });
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError('Failed to fetch problem data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    } else {
      setError('Problem ID is missing in the URL');
      setIsLoading(false);
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axiosClient.put(`/problem/update/${id}`, data);
      alert('Problem updated successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating problem:', error);
      alert('Error updating problem: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-500 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mb-2" />
          <p className="text-white">Loading problem data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-500 flex items-center justify-center">
        <div className="bg-base-100 rounded-lg shadow-md p-6 max-w-md mx-4">
          <div className="text-red-500 mb-4">{error}</div>
          <button onClick={() => navigate('/admin')} className="btn btn-primary w-full">
            Back to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-500 py-8">
      <button onClick={() => navigate('/admin')} className="btn btn-primary px-6 mb-4 ml-8">
        Back To Admin Access
      </button>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-base-100 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Update Problem</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('basic')}
                className="w-full flex items-center justify-between p-4 bg-gray-500 hover:bg-gray-600"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  <span className="font-medium">Basic Information</span>
                </div>
                {expandedSection === 'basic' ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {expandedSection === 'basic' && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Title</label>
                    <input
                      {...register('title')}
                      className="input input-bordered w-full"
                      placeholder="Problem title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Description</label>
                    <textarea
                      {...register('description')}
                      className="textarea textarea-bordered w-full h-32"
                      placeholder="Problem description"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Difficulty</label>
                      <select {...register('difficulty')} className="select select-bordered w-full">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Tag</label>
                      <select {...register('tags')} className="select select-bordered w-full">
                        <option value="array">Array</option>
                        <option value="linkedList">Linked List</option>
                        <option value="graph">Graph</option>
                        <option value="dp">Dynamic Programming</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Visible Test Cases Section */}
            <div className="border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('visible')}
                className="w-full flex items-center justify-between p-4 bg-gray-500 hover:bg-gray-600"
              >
                <div className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  <span className="font-medium">Visible Test Cases</span>
                </div>
                {expandedSection === 'visible' ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {expandedSection === 'visible' && (
                <div className="p-4 space-y-4">
                  {visibleFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-400">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Test Case {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeVisible(index)}
                          className="btn btn-sm btn-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Input</label>
                          <textarea
                            {...register(`visibleTestCases.${index}.input`)}
                            className="textarea textarea-bordered w-full"
                            rows="2"
                            placeholder="Test case input"
                          />
                          {errors.visibleTestCases?.[index]?.input && (
                            <p className="text-red-500 text-sm mt-1">{errors.visibleTestCases[index].input.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Output</label>
                          <textarea
                            {...register(`visibleTestCases.${index}.output`)}
                            className="textarea textarea-bordered w-full"
                            rows="2"
                            placeholder="Expected output"
                          />
                          {errors.visibleTestCases?.[index]?.output && (
                            <p className="text-red-500 text-sm mt-1">{errors.visibleTestCases[index].output.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
                          <textarea
                            {...register(`visibleTestCases.${index}.explanation`)}
                            className="textarea textarea-bordered w-full"
                            rows="2"
                            placeholder="Explanation of the test case"
                          />
                          {errors.visibleTestCases?.[index]?.explanation && (
                            <p className="text-red-500 text-sm mt-1">{errors.visibleTestCases[index].explanation.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                    className="btn btn-outline btn-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Test Case
                  </button>
                  
                  {errors.visibleTestCases && !errors.visibleTestCases.root && (
                    <p className="text-red-500 text-sm">{errors.visibleTestCases.message}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Hidden Test Cases Section */}
            <div className="border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('hidden')}
                className="w-full flex items-center justify-between p-4 bg-gray-500 hover:bg-gray-600"
              >
                <div className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  <span className="font-medium">Hidden Test Cases</span>
                </div>
                {expandedSection === 'hidden' ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {expandedSection === 'hidden' && (
                <div className="p-4 space-y-4">
                  {hiddenFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-400">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Hidden Test Case {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeHidden(index)}
                          className="btn btn-sm btn-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Input</label>
                          <textarea
                            {...register(`hiddenTestCases.${index}.input`)}
                            className="textarea textarea-bordered w-full"
                            rows="2"
                            placeholder="Test case input"
                          />
                          {errors.hiddenTestCases?.[index]?.input && (
                            <p className="text-red-500 text-sm mt-1">{errors.hiddenTestCases[index].input.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Output</label>
                          <textarea
                            {...register(`hiddenTestCases.${index}.output`)}
                            className="textarea textarea-bordered w-full"
                            rows="2"
                            placeholder="Expected output"
                          />
                          {errors.hiddenTestCases?.[index]?.output && (
                            <p className="text-red-500 text-sm mt-1">{errors.hiddenTestCases[index].output.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => appendHidden({ input: '', output: '' })}
                    className="btn btn-outline btn-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Hidden Test Case
                  </button>
                  
                  {errors.hiddenTestCases && !errors.hiddenTestCases.root && (
                    <p className="text-red-500 text-sm">{errors.hiddenTestCases.message}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Code Templates Section */}
            <div className="border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('code')}
                className="w-full flex items-center justify-between p-4 bg-gray-500 hover:bg-gray-600"
              >
                <div className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  <span className="font-medium">Code Templates</span>
                </div>
                {expandedSection === 'code' ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {expandedSection === 'code' && (
                <div className="p-4 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Starter Code</h3>
                    <div className="space-y-4">
                      {['cpp', 'java', 'javascript'].map((language, index) => (
                        <div key={language} className="border rounded-lg p-4 bg-gray-400">
                          <h4 className="font-medium mb-2 capitalize">{language} Starter Code</h4>
                          <textarea
                            {...register(`startCode.${index}.initialCode`)}
                            className="textarea textarea-bordered w-full font-mono text-sm"
                            rows="6"
                            placeholder={`${language.toUpperCase()} starter code`}
                          />
                          {errors.startCode?.[index]?.initialCode && (
                            <p className="text-red-500 text-sm mt-1">{errors.startCode[index].initialCode.message}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Reference Solutions</h3>
                    <div className="space-y-4">
                      {['cpp', 'java', 'javascript'].map((language, index) => (
                        <div key={language} className="border rounded-lg p-4 bg-gray-400">
                          <h4 className="font-medium mb-2 capitalize">{language} Solution</h4>
                          <textarea
                            {...register(`referenceSolution.${index}.completeCode`)}
                            className="textarea textarea-bordered w-full font-mono text-sm"
                            rows="8"
                            placeholder={`${language.toUpperCase()} complete solution`}
                          />
                          {errors.referenceSolution?.[index]?.completeCode && (
                            <p className="text-red-500 text-sm mt-1">{errors.referenceSolution[index].completeCode.message}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary px-6"
              >
                {isSubmitting ? 'Updating Problem...' : 'Update Problem'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProblem;