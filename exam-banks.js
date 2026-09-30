(() => {
  const prepareQuestions = (questions) => {
    const answerPositions = {};
    const levelOffsets = { easy:0, medium:1, hard:2 };
    return questions.map((question) => {
      if (question.type !== 'mcq' || !Array.isArray(question.options)) return { ...question };
      const group = question.level || 'all';
      const position = ((answerPositions[group] || 0) + (levelOffsets[group] || 0)) % question.options.length;
      answerPositions[group] = (answerPositions[group] || 0) + 1;
      const distractors = question.options.filter(option => option !== question.answer);
      const options = [...distractors];
      options.splice(position, 0, question.answer);
      return { ...question, options };
    });
  };

  const source = window.MBLL_QUESTION_BANKS;
  window.MBLL_BANKS = {
    microbiologyLab: {
      id:'microbiologyLab', title:'Microbiology Lab Exam', shortTitle:'Microbiology Lab', code:'LAB', accent:'teal',
      description:'Lab Modules 07–10 with multiple-choice, short-answer, and supplied course figures.',
      questions:prepareQuestions(source.microbiologyLab), sourceCount:19,
      coverage:[
        ['LM07 Eukaryotic Microbes','4 PDF pages, cleaned note, and 2 supplied figures','Protozoa, fungi, algae, helminths, and identification'],
        ['LM08 Quantitative Microbiology','3 PDF pages, cleaned note, and supplied figure','Counts, dilutions, growth phases, and generation time'],
        ['LM09 Growth Requirements','11 PDF pages, cleaned note, and 3 supplied figures','Oxygen, salt, temperature, pH, UV, and microbial control'],
        ['LM10 Selective and Differential Media','8 PDF pages, cleaned note, and 5 supplied figures','Media, hemolysis, fermentation, nitrate, catalase, and oxidase']
      ]
    },
    lectureExam1: {
      id:'lectureExam1', title:'Microbiology Lecture Exam 1', shortTitle:'Lecture Exam 1', code:'LEC 1', accent:'blue',
      description:'Chapters 7, 9, 10, 11, and 12. Multiple-choice only.',
      questions:prepareQuestions(source.lectureExam1), sourceCount:5,
      coverage:[
        ['Chapter 7 · Viruses','49 of 49 slides reviewed','Viral structure, replication, cultivation, and disease'],
        ['Chapter 9 · Microbial Nutrition and Growth','34 of 34 slides reviewed','Nutrients, environmental needs, and growth'],
        ['Chapter 10 · Metabolism','48 of 48 slides reviewed','Enzymes, ATP, respiration, and fermentation'],
        ['Chapter 11 · Control of Microbial Growth','33 of 33 slides reviewed','Physical and chemical control methods'],
        ['Chapter 12 · Antimicrobial Treatment','44 of 44 slides reviewed','Drug targets, susceptibility, and resistance']
      ]
    },
    lectureExam2: {
      id:'lectureExam2', title:'Microbiology Lecture Exam 2', shortTitle:'Lecture Exam 2', code:'LEC 2', accent:'purple',
      description:'Chapters 13–17. Multiple-choice only.',
      questions:prepareQuestions(source.lectureExam2), sourceCount:5,
      coverage:[
        ['Chapter 13 · Microbe–Human Interactions','40 of 40 slides reviewed','Microbiota, infection, pathogenesis, and disease'],
        ['Chapter 14 · Epidemiology','16 of 16 slides reviewed','Disease frequency, transmission, and outbreak analysis'],
        ['Chapter 15 · Innate Immunity','49 of 49 slides reviewed','Barriers, cells, inflammation, complement, and fever'],
        ['Chapter 16 · Adaptive Immunity','60 of 60 slides reviewed','Antigens, lymphocytes, antibodies, and memory'],
        ['Chapter 17 · Disorders in Immunity','31 of 31 slides reviewed','Hypersensitivity, autoimmunity, and immunodeficiency']
      ]
    },
    apLab: {
      id:'apLab', title:'Human A&P Lab Exam', shortTitle:'A&P Lab', code:'A&P', accent:'orange',
      description:'Image-based short-answer practice for endocrine, blood, heart, vessels, ECG, and blood pressure.',
      questions:prepareQuestions(source.apLab), sourceCount:10,
      coverage:[
        ['Five supplied Human A&P Lab review sheets','All visible objectives reviewed','Endocrine, blood, heart, vessels, ECG, pulse, and blood pressure'],
        ['Five generated medical base illustrations','Endocrine, blood cells, heart, vessels, and conduction/ECG','Created specifically for this practice system'],
        ['Question-specific figure set','58 of 58 short-answer questions have a unique marked image','Every prompt contains its own target figure']
      ]
    }
  };
})();
