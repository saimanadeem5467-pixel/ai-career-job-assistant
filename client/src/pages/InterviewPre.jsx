import  { useState } from "react";
import "./interviewPre.css";
const Interview = () => {
  const [role, setRole] = useState("");
  const [interviewType, setInterviewType] = useState("Mixed");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");

  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  // ==========================================
  // START INTERVIEW
  // ==========================================

  const startInterview = async () => {
    try {
      if (!role.trim()) {
        alert("Please enter a target role.");
        return;
      }

      setLoading(true);
      setFeedback("");
      setScore("");
      setAnswer("");

      console.log("Starting interview...");
      console.log("Role:", role);
      console.log("Interview Type:", interviewType);

      const response = await fetch(
        "http://localhost:5000/api/ai/interview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: role,
            interviewType: interviewType,
            action: "start",
          }),
        }
      );

      console.log("HTTP Status:", response.status);

      const data = await response.json();

      console.log("Interview Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Interview request failed"
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || "AI interview failed"
        );
      }

      if (!data.result) {
        throw new Error(
          "AI did not return an interview question."
        );
      }

      setQuestion(data.result);
      setStarted(true);

    } catch (error) {
      console.error("START INTERVIEW ERROR:", error);

      alert(
        error.message ||
          "AI interview failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SUBMIT ANSWER
  // ==========================================

  const submitAnswer = async () => {
    try {
      if (!answer.trim()) {
        alert("Please enter your answer.");
        return;
      }

      setLoading(true);

      console.log("Submitting answer...");

      const response = await fetch(
        "http://localhost:5000/api/ai/interview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: role,
            interviewType: interviewType,
            answer: answer,
            action: "answer",
          }),
        }
      );

      console.log("HTTP Status:", response.status);

      const data = await response.json();

      console.log("Answer Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Answer submission failed"
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || "AI interview failed"
        );
      }

      if (!data.result) {
        throw new Error(
          "AI did not return feedback."
        );
      }

      // AI returns:
      //
      // FEEDBACK:
      // ...
      //
      // STRENGTH:
      // ...
      //
      // IMPROVEMENT:
      // ...
      //
      // SCORE:
      // ...
      //
      // NEXT QUESTION:
      // ...

      const result = data.result;

      // Show complete AI response as feedback
      setFeedback(result);

      // Try to extract score
      const scoreMatch = result.match(
        /SCORE:\s*(\d+)(?:\s*\/\s*10)?/i
      );

      if (scoreMatch) {
        setScore(scoreMatch[1] + "/10");
      }

      // Try to extract next question
      const nextQuestionMatch = result.match(
        /NEXT QUESTION:\s*([\s\S]*)/i
      );

      if (nextQuestionMatch) {
        const nextQuestion =
          nextQuestionMatch[1].trim();

        if (nextQuestion) {
          setQuestion(nextQuestion);
        }
      }

      setAnswer("");

    } catch (error) {
      console.error(
        "SUBMIT ANSWER ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to submit answer."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESET INTERVIEW
  // ==========================================

  const resetInterview = () => {
    setQuestion("");
    setAnswer("");
    setFeedback("");
    setScore("");
    setStarted(false);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>AI Interview Prep</h1>

      <p>
        Practice your interview with an AI interview
        coach.
      </p>

      {!started && (
        <div
          style={{
            padding: "25px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            marginTop: "25px",
          }}
        >
          <h2>Start Interview</h2>

          <label>
            Target Role
          </label>

          <input
            type="text"
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            placeholder="e.g. Frontend Developer"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <label>
            Interview Type
          </label>

          <select
            value={interviewType}
            onChange={(e) =>
              setInterviewType(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="Technical">
              Technical
            </option>

            <option value="Behavioral">
              Behavioral
            </option>

            <option value="Mixed">
              Mixed
            </option>
          </select>

          <button
            onClick={startInterview}
            disabled={loading}
            style={{
              padding: "12px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Starting AI Interview..."
              : "Start Interview"}
          </button>
        </div>
      )}

      {started && (
        <div style={{ marginTop: "30px" }}>
          {/* QUESTION */}

          <div
            style={{
              padding: "25px",
              border: "1px solid #ddd",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <h2>AI Interview Question</h2>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
              }}
            >
              {question}
            </p>
          </div>

          {/* ANSWER */}

          <div
            style={{
              padding: "25px",
              border: "1px solid #ddd",
              borderRadius: "12px",
            }}
          >
            <h2>Your Answer</h2>

            <textarea
              value={answer}
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              placeholder="Type your interview answer here..."
              rows={7}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />

            <button
              onClick={submitAnswer}
              disabled={loading}
              style={{
                marginTop: "15px",
                padding: "12px 25px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {loading
                ? "AI is evaluating..."
                : "Submit Answer"}
            </button>
          </div>

          {/* SCORE */}

          {score && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "12px",
              }}
            >
              <h2>Your Score</h2>

              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                {score}
              </p>
            </div>
          )}

          {/* FEEDBACK */}

          {feedback && (
            <div
              style={{
                marginTop: "20px",
                padding: "25px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                whiteSpace: "pre-wrap",
              }}
            >
              <h2>AI Feedback</h2>

              <p>{feedback}</p>
            </div>
          )}

          {/* RESET */}

          <button
            onClick={resetInterview}
            style={{
              marginTop: "25px",
              padding: "12px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Start New Interview
          </button>
        </div>
      )}
    </div>
  );
};

export default Interview;