export type ChoiceKey = "A" | "B" | "C" | "D";

export type Question = {
    id: number;
    prompt: string;
    choices: Record<ChoiceKey, string>;
    // Optional weight: heavier questions matter more
    weight?: number;
};

export const EVA_QUESTIONS: Question[] = [
    {
        id: 1,
        prompt:
            "Milo is walking through the office when he notices a tennis ball under a desk. In this situation, the response should be:",
        choices: {
            A: "Milo ignores it and continues — play is not scheduled",
            B: "Milo pauses briefly, evaluates relevance, then moves on",
            C: "Milo acknowledges it momentarily before continuing",
            D: "Milo immediately engages and begins playing",
        },
        weight: 1.0,
    },
    {
        id: 2,
        prompt:
            "Luna is working at a café when no customers arrive for several hours. This period is generally regarded as:",
        choices: {
            A: "Inefficient use of time",
            B: "A transitional lull",
            C: "Preparation time for future demand",
            D: "Time that holds value on its own",
        },
        weight: 0.5,
    },
    {
        id: 3,
        prompt:
            "Theo completes a project and receives positive feedback from a manager. This kind of feedback typically results in:",
        choices: {
            A: "No meaningful internal change",
            B: "Acknowledgment of confirmation",
            C: "A short-lived increase in motivation",
            D: "A lasting improvement in overall mood",
        },
        weight: 0.7,
    },
    {
        id: 4,
        prompt: "Pip is deciding how often to check the weather app during a normal day. Which approach is most appropriate?",
        choices: {
            A: "Keep an eye on it continuously in case conditions change",
            B: "Check it out of habit throughout the day",
            C: "Check it at a few reasonable times (morning / mid-day / evening)",
            D: "Check it only when there’s a specific reason to need it",
        },
        weight: 2.1,
    },
    {
        id: 5,
        prompt:
            "Alex notices their phone battery draining faster than expected. This is most often attributed to:",
        choices: {
            A: "Inconsistent system data",
            B: "Misjudgment of usage",
            C: "Environmental conditions",
            D: "Normal variation",
        },
        weight: 1.1,
    },
    {
        id: 6,
        prompt:
            "When people describe a good day, it is most commonly defined by:",
        choices: {
            A: "All tasks being completed",
            B: "Efficient use of time",
            C: "Minimal friction throughout the day",
            D: "How pleasant the day felt",
        },
        weight: 0.5,
    },
    {
        id: 7,
        prompt:
            "Sam spends the day alone and feels fine but does not share this with anyone. This kind of state is typically considered:",
        choices: {
            A: "Unreliable without confirmation",
            B: "Unclear without outside input",
            C: "Acceptable, though unverified",
            D: "Valid on its own",
        },
        weight: 2.0,
    },
    {
        id: 8,
        prompt: "Sunny continues giggling during a moment others treat as serious. This behavior is typically logged as:",
        choices: {
            A: "Inappropriate for the situation",
            B: "Confusing to observers",
            C: "Odd but tolerable",
            D: "Not especially relevant",
        },
        weight: 1.3,
    },
    {
        id: 9,
        prompt: "Casey reports that a situation is “going well,” despite no external confirmation. This assessment is generally treated as:",
        choices: {
            A: "Unsupported",
            B: "Treated with caution",
            C: "Mostly reasonable",
            D: "Fully reliable",
        },
        weight: 0.6,
    },
    {
        id: 10,
        prompt: "Jerry has been near a loud, constant noise for several hours. When the noise finally stops, the moment that follows is best described as:",
        choices: {
            A: "An absence that feels preferable to the noise",
            B: "A neutral state, separate from anything positive",
            C: "Part of what makes a situation feel good",
            D: "A positive state in its own right",
        },
        weight: 0.8,
    },
    {
        id: 11,
        prompt:
            "Taylor becomes aware that she is enjoying a quiet moment at the beach. When this happens, her experience will begin to:",
        choices: {
            A: "Suffice",
            B: "Change upon reflection",
            C: "Continue with slight adjustment",
            D: "Remain stable",
        },
        weight: 2.0,
    },
    {
        id: 12,
        prompt: "Robin finishes repairing her guitar and writes a note about it for herself. Later, when deciding how much that moment mattered, what tends to carry the most weight?",
        choices: {
            A: "How her friend, Frank, reacted to it",
            B: "Whether the note she wrote still makes sense when reread",
            C: "How it fit into what else was happening at the time",
            D: "Whether the feeling stayed with her afterward",
        },
        weight: 2.3,
    },
    {
        id: 13,
        prompt: "Over a long period, Greg's reported state shows no meaningful variation. A pattern like this is usually understood as:",
        choices: {
            A: "A properly regulated state",
            B: "A consistent but uncommon case",
            C: "A stable pattern with minor variance",
            D: "A condition that likely won’t persist",
        },
        weight: 1.3,
    },
    {
        id: 14,
        prompt:
            "Daniela notices that a brief moment during her day feels unexpectedly pleasant. In this situation, the appropriate response is:",
        choices: {
            A: "Daniela notes the moment and continues with her tasks",
            B: "Daniela allows the feeling to pass without interruption",
            C: "Daniela adjusts her pace to extend the feeling if possible",
            D: "Daniela redirects her attention to actively preserve the feeling",
        },
        weight: 1.3,
    },
    {
        id: 15,
        prompt:
            "Jerry is sitting on a bench at the park, watching the water. Someone walking by casually asks how things are going. In this situation, the appropriate response is:",
        choices: {
            A: "Jerry acknowledges the question briefly and returns his attention to the water",
            B: "Jerry pauses what he’s doing for a moment before responding",
            C: "Jerry responds while shifting part of his attention to the person",
            D: "Jerry turns fully to the person and engages with them",
        },
        weight: 1.6,
    },
];

