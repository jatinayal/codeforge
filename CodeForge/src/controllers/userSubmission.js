const Problem = require("../models/problem");
const Submissions = require("../models/submissions");
const User = require("../models/user");
const { getLanguageById, submitBatch, submitToken } = require("../utils/ProblemUtility");

const submitCode = async(req, res)=>{

    try{
        const userId = req.result._id;
        const problemId = req.params.id;

        const {code,language} = req.body;

        if(!userId||!code||!problemId||!language)
            return res.status(400).send("Some Field Missing");

        const problem = await Problem.findById(problemId);
        if (!problem) {
    return res.status(404).send("Problem not found");
}

        const submittedResult = await Submissions.create({
        userId,
        problemId,
        code,
        language,
        testCasesPassed:0,
        status:'pending',
        testCasesTotal:problem.hiddenTestCases.length
        })

        const languageId = getLanguageById(language);
          const submissions = problem.hiddenTestCases.map((testcase)=>({
                    source_code:code,
                    language_id:languageId,
                    stdin:testcase.input,
                    expected_output:testcase.output

                }));


                const submitResult = await submitBatch(submissions);
                
                const resultToken = submitResult.map((value) => value.token);
                
                const testResult = await submitToken(resultToken);

                let testCasesPassed = 0;
                let runtime = 0;
                let memory = 0;
                let status = 'accepted';
                let errorMessage = null;

                for(const test of testResult){
                    if(test.status_id==3){
                        testCasesPassed++;
                        runtime = runtime+parseFloat(test.time);
                        memory = Math.max(memory,test.memory);
                    }else{
                        if(test.status_id==4){
                            status= 'error'
                            errorMessage = test.stderr
                        }
                        else{
                            status= 'wrong'
                            errorMessage = test.stderr
                        }
                    }
                }

                submittedResult.status = status;
                submittedResult.testCasesPassed = testCasesPassed;
                submittedResult.errorMessage = errorMessage;
                submittedResult.runtime = runtime;
                submittedResult.memory = memory;


                await submittedResult.save();

                if(!req.result.problemSolved.includes(problemId)){
                    req.result.problemSolved.push(problemId);
                    await req.result.save();
                }

                res.status(201).send(submittedResult);
    }
    catch(err){
        console.log("ERROR: ",err);
        res.status(500).send("Internal server Error: "+err.message);
    }
}

const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("Some Field Missing");
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    const languageId = getLanguageById(language);
    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime = runtime + parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status_id == 4) {
          status = 'error';
          errorMessage = test.stderr;
        } else {
          status = 'wrong';
          errorMessage = test.stderr;
        }
      }
    }

    // Create a response object that matches the format of submitCode
    // but without saving to the database
    const response = {
      _id: null, // No database ID
      userId: userId,
      problemId: problemId,
      code: code,
      language: language,
      status: status,
      runtime: runtime,
      memory: memory,
      errorMessage: errorMessage,
      testCasesPassed: testCasesPassed,
      testCasesTotal: problem.visibleTestCases.length,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(200).send(response);
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(500).send("Internal server Error: " + err.message);
  }
};

module.exports = {submitCode,runCode};