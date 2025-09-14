import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { Trash2, AlertTriangle } from 'lucide-react';

function DeleteProblem() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axiosClient.delete(`/problem/deleteProblem/${selectedProblem._id}`);
      setMessage('Problem deleted successfully!');
      setSelectedProblem(null);
      setShowConfirm(false);
      fetchProblems(); // Refresh the list
    } catch (error) {
      console.error('Error deleting problem:', error);
      setMessage('Error deleting problem: ' + (error.response?.data || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Delete Problem</h2>
      
      {/* Problem Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Problem to Delete</label>
        <select
          onChange={(e) => setSelectedProblem(problems.find(p => p._id === e.target.value))}
          className="select select-bordered w-full"
        >
          <option value="">Select a problem</option>
          {problems.map((problem) => (
            <option key={problem._id} value={problem._id}>
              {problem.title} ({problem.difficulty})
            </option>
          ))}
        </select>
      </div>

      {selectedProblem && !showConfirm && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium text-lg">{selectedProblem.title}</h3>
          <p className="text-gray-600 mt-1">{selectedProblem.description.substring(0, 100)}...</p>
          <div className="flex items-center mt-3">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              selectedProblem.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              selectedProblem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {selectedProblem.difficulty}
            </span>
            <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 text-xs font-semibold rounded-full">
              {selectedProblem.tags}
            </span>
          </div>
          
          <button
            onClick={() => setShowConfirm(true)}
            className="btn btn-error mt-4"
          >
            <Trash2 size={18} className="mr-2" />
            Delete Problem
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="border border-red-300 rounded-lg p-4 bg-red-50">
          <div className="flex items-center mb-3">
            <AlertTriangle className="text-red-600 mr-2" />
            <h3 className="font-medium text-red-800">Confirm Deletion</h3>
          </div>
          
          <p className="text-red-700 mb-4">
            Are you sure you want to delete "{selectedProblem.title}"? This action cannot be undone.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="btn btn-error px-4"
            >
              {isLoading ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="btn btn-outline px-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {message && (
        <div className={`p-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default DeleteProblem;