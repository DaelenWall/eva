import { useMemo, useState } from "react";
import { EVA_QUESTIONS, type ChoiceKey } from "../eva/questions";
import { scoreEva } from "../eva/score";

function toSubmissionString(answers: Record<number, ChoiceKey>) {
    const ids = Object.keys(answers).map(Number).sort((a, b) => a - b);
    return ids.map((id) => `${id}${answers[id]}`).join(", ");
}

export default function EvaAssessment() {
    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");

    const [answers, setAnswers] = useState<Record<number, ChoiceKey>>({});
    const [submitted, setSubmitted] = useState(false);
    const [processed, setProcessed] = useState(false);

    const total = EVA_QUESTIONS.length;
    const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

    const result = useMemo(() => {
        if (!submitted) return null;
        return scoreEva(EVA_QUESTIONS, answers);
    }, [submitted, answers]);

    const onSelect = (qid: number, choice: ChoiceKey) => {
        setAnswers((prev) => ({ ...prev, [qid]: choice }));
    };

    const canSubmit = answeredCount === total;

    return (
        <div style={{ maxWidth: 820, margin: "40px auto", padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
            <h1 style={{ marginBottom: 6 }}>EVA™ — Emotional Variance Assistant</h1>
            {!submitted && (
                <div style={{ opacity: 0.85, marginBottom: 18 }}>
                    <div>
                        <strong>Instructions:</strong> Select the response you most clearly align with. There is no neutral option. We ask that you do not revise your answers.
                    </div>
                </div>
            )}

            {!submitted && (
                <div style={{ marginBottom: 18 }}>
                    Progress: <strong>{answeredCount}</strong> / {total}
                </div>
            )}
            {!submitted && (
                <div style={{ maxWidth: 420, marginBottom: 24 }}>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", marginBottom: 4 }}>
                            First Name
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            style={{
                                width: "100%",
                                padding: 8,
                                borderRadius: 6,
                                border: "1px solid #111",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", marginBottom: 4 }}>
                            Surname
                        </label>
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            style={{
                                width: "100%",
                                padding: 8,
                                borderRadius: 6,
                                border: "1px solid #111",
                            }}
                        />
                    </div>

                    {(!firstName || !surname) && (
                        <div style={{ opacity: 0.7, fontSize: 14 }}>
                            Identification required to proceed.
                        </div>
                    )}
                </div>
            )}

            {!submitted ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (canSubmit) setSubmitted(true);
                    }}
                >
                    {EVA_QUESTIONS.map((q) => (
                        <div key={q.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14, marginBottom: 12 }}>
                            <div style={{ marginBottom: 10 }}>
                                <strong>{q.id}.</strong> {q.prompt}
                            </div>

                            <div style={{ display: "grid", gap: 8 }}>
                                {(["A", "B", "C", "D"] as ChoiceKey[]).map((k) => {
                                    const checked = answers[q.id] === k;
                                    return (
                                        <label key={k} style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                                            <input
                                                type="radio"
                                                name={`q-${q.id}`}
                                                checked={checked}
                                                onChange={() => onSelect(q.id, k)}
                                            />
                                            <span><strong>{k}</strong> {q.choices[k]}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 10,
                            border: "1px solid #111",
                            background: canSubmit ? "#111" : "#999",
                            color: "#fff",
                            cursor: canSubmit ? "pointer" : "not-allowed",
                            fontWeight: 700,
                        }}
                    >
                        Submit for Processing
                    </button>

                    {!canSubmit && (
                        <div style={{ marginTop: 10, opacity: 0.75 }}>
                            Complete all items to submit.
                        </div>
                    )}
                </form>
            ) : (
                <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
                    <h2 style={{ marginTop: 0 }}>
                        STATUS: {processed ? "PROCESSED" : "AWAITING PROCESSING"}
                    </h2>

                    <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                        <div><strong>EVA Index:</strong> {result!.index}</div>
                        <div><strong>Percentile:</strong> {result!.percentile}th</div>
                        <div><strong>Classification:</strong> {result!.classification}</div>
                    </div>

                    {result!.flags.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                            <strong>Flagged Observations (Non-Critical):</strong>
                            <ul>
                                {result!.flags.map((f) => <li key={f}>{f}</li>)}
                            </ul>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                            type="button"
                            onClick={() => {
                                setSubmitted(false);
                                setAnswers({});
                                setProcessed(false);
                            }}
                            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111", background: "#000000ff", cursor: "pointer", fontWeight: 700 }}
                        >
                            Reset
                        </button>
                        {!processed && (
                            <button
                                type="button"
                                onClick={() => {
                                    setTimeout(() => {
                                        setProcessed(true);
                                    }, 5000);

                                    const submissionString = toSubmissionString(answers);

                                    const endpoint =
                                        "https://script.google.com/macros/s/AKfycbxNJYBKMwSxbsCeaO2dtnPpbzM2dbdXR869FlouVOX1TWJEwzTXg5AOkijtvGflw9f4/exec";

                                    const body = new URLSearchParams({
                                        firstName: firstName.trim(),
                                        surname: surname.trim(),
                                        index: String(result!.index),
                                        percentile: String(result!.percentile),
                                        classification: result!.classification,
                                        submission: submissionString,
                                        userAgent: navigator.userAgent,
                                    });

                                    fetch(endpoint, {
                                        method: "POST",
                                        mode: "no-cors",
                                        headers: {
                                            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                                        },
                                        body,
                                    })
                                        .then(() => {
                                            alert("Status: Processed");
                                        })
                                        .catch(() => {
                                            alert("Processed with warnings.");
                                        });
                                }}
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: 10,
                                    border: "1px solid #000000ff",
                                    background: "#000000ff",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                }}
                            >
                                Complete Processing
                            </button>
                        )}




                    </div>

                </div>)}
        </div>)
}