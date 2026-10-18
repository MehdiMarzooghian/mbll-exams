# MBLL Exam Studio

An English browser-based exam and flashcard application built from the four source folders in `mbll`.

## Exam banks

- **Microbiology Lab Exam:** Lab Modules 07–10, multiple-choice and short-answer
- **Microbiology Lecture Exam 1:** Chapters 7, 9, 10, 11, and 12, multiple-choice only
- **Microbiology Lecture Exam 2:** Chapters 13–17, multiple-choice only
- **Human A&P Lab Exam:** image-based short-answer only

The A&P dashboard also offers six photo-based lesson exams: Endocrine System (23 questions), Blood (10), Heart Anatomy (26), Heart Dissection (5), Blood Vessels & Cranial Circulation (16), and ECG/Heart Sounds/Pulse/Blood Pressure (16). These 96 new questions use all 16 supplied course photographs, with code-native SVG viewports and target markers. The combined A&P bank retains the original 58 questions and adds these 96.

Existing browser storage keys, original question IDs, saved results, and drafts are preserved. Each new lesson has its own progress and mistake-review unlock. The all-subject flashcard deck avoids duplicates from lesson sub-banks.

The three microbiology banks offer comprehensive exams for the entire course or individual chapters/modules, with no difficulty selection. Multiple-choice answers receive immediate green/red feedback and lock the first selection. Lab short answers use Check answer. Completing a comprehensive exam unlocks Mistake Review. The 579-question Maeita custom deck also uses immediate feedback. A&P banks retain Easy, Medium, and Hard levels.

Existing results and mistakes keep their browser storage keys and question IDs. Legacy microbiology drafts are combined into a comprehensive draft with their responses preserved; completing all three legacy levels counts as completed comprehensive practice.

## Saved data

Results, drafts, mistakes, completion status, and flashcard progress are stored locally in the browser. The storage prefix is unique to this application, so it does not overwrite data from the earlier MicroLab Exam site.

## Source coverage

The October 18 content revision retires the former generic sentence-selection MCQs. Lab now contains 98 authored MCQs plus 79 retained short-answer/figure questions (177 total); Lecture 1 uses the 579 specific Maeita questions; Lecture 2 contains 180 authored MCQs. Readable source rows are in `authoring/`, and `scripts/rebuild-banks.py` compiles them against the local extracted course records. `coverage/reviewed-banks.json` maps source pages/slides to question IDs. A link establishes traceability, not a promise that every sentence is assessed. `coverage/retired-questions.json` archives removed MCQs and is not loaded by the app.

Question IDs are never reassigned to different material. The app keeps historical results and mistakes, archives obsolete drafts/completion data, and only uses currently valid IDs in mistake review. The revised banks track new completion and best scores separately from historical attempts. Shared Lecture 1/Maeita flashcards are deduplicated by question ID.

The source view records the reviewed PDFs, cleaned notes, PowerPoint slide counts, supplied figures, and generated A&P figures. Every question stores a source locator and explanation.

## Run locally

Serve the folder with any static web server and open `index.html`. No build step or backend is required.
