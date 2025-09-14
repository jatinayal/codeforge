const {getLanguageById, submitBatch, submitToken} = require('../utils/ProblemUtility');
const Problem = require('../models/problem');
const User = require('../models/user');
const Submissions = require('../models/submissions');
const SolutionVideo = require('../models/solutionVideo');
  
const createProblem = async (req, res) => {
  console.log(req.body);
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator
  } = req.body;

  try {
    // Validate each reference solution
    for (const solution of referenceSolution) {
      const languageId = getLanguageById(solution.language);
      
      if (!languageId) {
        return res.status(400).send(`Unsupported language: ${solution.language}`);
      }

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: solution.completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));

      const submitResult = await submitBatch(submissions);
      console.log(submitResult)
      const resultToken = submitResult.map((value) => value.token);
      console.log(resultToken)
      const testResult = await submitToken(resultToken);
      console.log(testResult)

      for (const test of testResult) {
        if (test.status_id !== 3) {
          return res.status(400).send(`Reference solution failed for ${solution.language}. Test case error: ${test.status.description}`);
        }
      }
    }

    // Transform the data to match your Problem schema
    const problemData = {
      title,
      description,
      difficulty: difficulty.toLowerCase(),
      tags: tags.toLowerCase(),
      visibleTestCases: visibleTestCases.map(testCase => ({
        input: testCase.input,
        output: testCase.output,
        explanation: testCase.explanation || testCase.explaination // Handle both spellings
      })),
      hiddenTestCases: hiddenTestCases.map(testCase => ({
        input: testCase.input,
        output: testCase.output
      })),
      startCode: startCode.map(code => ({
        language: code.language.toLowerCase(),
        initialCode: code.initialCode
      })),
      referenceSolution: referenceSolution.map(solution => ({
        language: solution.language.toLowerCase(),
        completeCode: solution.completeCode
      })),
      problemCreator: req.result._id
    };

    const userProblem = await Problem.create(problemData);
    return res.status(201).json({ // Added return
      message: "Problem Saved Successfully",
      problemId: userProblem._id
    });
  } catch (err) {
    console.error("Error creating problem:", err);
    return res.status(500).json({ // Added return
      error: "Internal Server Error",
      details: err.message
    });
  }
};


const updateProblem =async(req, res) =>{
    const {id} = req.params;
    const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator} = req.body;
    try{
        if(!id){
           return res.status(400).send("Missing ID Field");
        } 

        const DsaProblem = await Problem.findById(id);
        if(!DsaProblem){
            return res.status(404).send("ID is not present in server");
        }
        for(const {language,completeCode} of referenceSolution){ 
            const languageId = getLanguageById(language);

                const submissions = visibleTestCases.map((testcase)=>({
                    source_code:completeCode,
                    language_id:languageId,
                    stdin:testcase.input,
                    expected_output:testcase.output

                }));

                const submitResult = await submitBatch(submissions);
                // console.log(submitResult);

                const resultToken = submitResult.map((value) => value.token);

                const testResult = await submitToken(resultToken);

                // console.log(testResult)

                for(const test of testResult){
                    if(test.status_id!=3){
                       return res.status(400).send("Error Occured");
                    }
                }
            
            };

          const newProblem =   await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators:true, new:true});
          
          return res.status(200).send(newProblem); // Added return
    }
    catch(err){
        return res.status(500).send("Error"+err.message); // Added return
    }
}



const deleteProblem = async(req, res) =>{
    const {id} = req.params;
    try{
        if(!id)
            return res.status(400).send("ID is Missing");

        const deletedProblem = await Problem.findByIdAndDelete(id);

        if(!deletedProblem)
            return res.status(404).send("Problem is Missing");

        return res.status(200).send("Succesfully Deleted"); // Added return
        
    }
    catch(err){
        return res.status(500).send("Error"+err.message); // Added return
    }
}


const getProblemById = async(req, res) => {
    const { id } = req.params;
    try {
        if (!id)
            return res.status(400).send("ID is Missing");

        const fetchedProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');

        if (!fetchedProblem)
            return res.status(404).send("Problem is Missing");

        // Find videos for this problem
        const videos = await SolutionVideo.find({ problemId: id });
        
        // If videos exist, use the first one
        if (videos && videos.length > 0) {
            const video = videos[0]; // Get the first video
            const responseData = {
                ...fetchedProblem.toObject(),
                secureUrl: video.secureUrl,
                thumbnailUrl: video.thumbnailUrl,
                duration: video.duration
            };
            return res.status(200).send(responseData);
        }

        // If no videos found, just return the problem
        return res.status(200).send(fetchedProblem); // Added return
    } catch (err) {
        return res.status(500).send("Error:" + err.message); // Added return
    }
}


const getAllProblem = async(req,res)=>{
    try{
        const fetchedProblem = await Problem.find({}).select('_id title difficulty tags');

        if(fetchedProblem.length==0)
            return res.status(404).send("Problem is Missing");

        return res.status(200).send(fetchedProblem); // Added return
    }
    catch(err){
        return res.status(500).send("Error:"+err.message); // Added return
    }
}


const solvedAllProblembyUser = async(req, res)=>{
    try{
        const userId = req.result._id;

        const user = await User.findById(userId).populate({
            path:"problemSolved",
            select:"_id title difficulty tags"
        });

        return res.status(200).send(user.problemSolved); // Added return
    }
    catch(err){
        return res.status(500).send("Error: "+err.message); // Added return
    }
}


const submittedProblem = async(req, res)=>{
    try{
        const userId = req.result._id;
        const problemId = req.params.pid;

        const ans = await Submissions.find({userId,problemId});

        if(ans.length==0)
            return res.status(200).send("No Submission is Present"); // Added return

        return res.status(200).send(ans); // Added return
    }
    catch(err){
        return res.status(500).send("Internal Server Error"); // Added return
    }
}


module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem};