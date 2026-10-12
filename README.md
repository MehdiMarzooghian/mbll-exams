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

The source view records the reviewed PDFs, cleaned notes, PowerPoint slide counts, supplied figures, and generated A&P figures. Every question stores a source locator and explanation.

## Run locally

Serve the folder with any static web server and open `index.html`. No build step or backend is required.
