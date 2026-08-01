"""
data/quiz_content.py

Question/Option text for all 4 quiz instruments. 

Structure notes:
  - SCQ: each of the 48 questions has its OWN unique 5-option scale
    (SCQ_OPTIONS[i] goes with SCQ_QUESTIONS[i]). Options are already ordered
    best-to-worst for that specific question, so scoring is always
    5,4,3,2,1 by display position -- no separate reversal logic needed,
    unlike GWBS.
  - GWBS / TABBPS / EI: all questions within each instrument share ONE
    option scale (GWBS_OPTIONS, TABBPS_OPTIONS, EI_OPTIONS respectively).
"""

# ---------------------------------------------------------------------------
# SCQ -- 48 questions, each with its own unique option set
# ---------------------------------------------------------------------------

SCQ_QUESTIONS = [
    'Do your friends come to you for advice?',
    'What do you think about your appearance?',
    'How do you find yourself in doing physical work?',
    'How do you find your temperament?',
    'How do you like school studies?',
    'Do you believe in religious customs and traditions?',
    'Do you participate in criticising others?',
    'Do you express your ideas frankly in the presence of others?',
    'How do you like your complexion?',
    'Do you consider yourself one of the cheerful persons?',
    'Do you behave abnormally also?',
    'Do you consider yourself an experienced person?',
    'Do you think about your teachers?',
    'Do you consider yourself to be a cool-tempered man?',
    'Are you regular in doing your home-work assignments?',
    'Do you insult others?',
    'Do you have difficulty in understanding something when the teacher explains in the class?',
    'Do you think if you get an opportunity you can discover something new?',
    'Do you feel irritated if somebody finds fault with your work?',
    'How do you find your personality?',
    'How do you like the company of others?',
    'How much are you satisfied with your weight?',
    'Do you feel irritated while you face petty difficulties?',
    'Are you coward by nature?',
    'How much are you satisfied with the present position of your studies in class?',
    'How do you like school examination?',
    'How is your voice?',
    'Are you curious to know the end while reading a novel or seeing a movie?',
    'How do you find your health?',
    'How is your attendance in the class?',
    'How much are you satisfied with your height?',
    'Do you try to get first position in the tests given in the class?',
    'Do you take care of the merits and demerits of a work before doing it?',
    'Where do you place yourself while speaking truth?',
    'Where do you place yourself in obeying public rules e.g. rules pertaining to public places, like road, park, railway station etc.?',
    'Are you more intelligent than your colleagues?',
    'Do you take part in organizing it when your classmates go to picnic etc.?',
    'Do you solve yourself the difficulties and problems of your studies?',
    'How much do you attend to artistic aspect of the photograph while seeing or making it?',
    'What will you do if you are doing some important work and your friends ask you to accompany them for a walk?',
    'While taking the examination you are not able to answer some question and a book of the same subject is lying near you, will you take help of the book?',
    'If you get an opportunity to drink water in the house of so called low caste persons, what will you do?',
    'Do you hesitate in mixing with persons of opposite sex?',
    'You are standing in the bus queue for a long time, when the bus comes, the conductor takes some passengers and stops at your turn because there is no space in the bus, what will you do in these circumstances?',
    'What will you do if you come to know of immoral character of your friend?',
    'You have to do four tasks – (a) you have to call the doctor to show your sick brother (b) you have to do the preparation for going out the next day (c) you have to read novel (d) the friend is going away, you have to go to see him. What will you do in the first place?',
    'Your friend gives you one thousand rupees to keep when you count, they are eleven hundred. What will you do?',
    'Do you like to do the work keeping in mind the desire of other?',
]

# SCQ_OPTIONS[i] is the 5-option scale for SCQ_QUESTIONS[i] (same index).
# Always assign score_value 5,4,3,2,1 in this display order --
# each list is already ordered from the most positive to least positive
# response for THAT specific question.
SCQ_OPTIONS = [
    ['Always', 'Usually', 'Sometimes', 'Usually Not', 'Never'],
    ['Very Beautiful', 'Beautiful', 'Satisfactory', 'Not Satisfactory', 'Ugly'],
    ['Very Strong', 'Strong', 'Average', 'Delicate', 'Very Delicate'],
    ['Always Cheerful', 'Cheerful', 'Normal', 'Sometimes Unhappy', 'Always Unhappy'],
    ['Very Good', 'Good', 'Average', 'Not Good', 'Not Good at All'],
    ['Very Much', 'Usually', 'Normally', 'Sometimes', 'Never'],
    ['Always', 'Mostly', 'Generally', 'Not Usually', 'Never'],
    ['Always', 'Mostly', 'Normally', 'Sometimes', 'Never'],
    ['Very Beautiful', 'Beautiful', 'Normal', 'Not So Beautiful', 'Ugly'],
    ['Always', 'Mostly', 'Normally', 'No', 'Never'],
    ['Always', 'Mostly', 'Sometimes', 'Seldom', 'Never'],
    ['Highly', 'Usually', 'Average', 'Less Experienced', 'Without any Experience'],
    ['Always', 'Mostly', 'Normally', 'Usually Not', 'Never'],
    ['Very Much', 'Usually', 'Average', 'Some Disturbed', 'Much Disturbed'],
    ['Always', 'Mostly', 'Normally', 'Sometimes', 'Never'],
    ['Never', 'Not Often', 'Usually', 'Mostly', 'Always'],
    ['Never', 'Usually', 'Generally', 'Often Feel Difficulty', 'Usually Feel Difficulty'],
    ['Definitely', 'Most Probably', 'Probably', 'Doubtful', 'Not at All'],
    ['Never', 'Usually Not', 'Sometimes', 'Usually', 'Always'],
    ['Most Attractive', 'Attractive', 'Normal', 'Unattractive', 'Totally Unattractive'],
    ['Always Good', 'Mostly Good', 'Usually Good', 'Sometimes Dislike', 'Never Like'],
    ['Fully Satisfied', 'Satisfied', 'Usually Satisfied', 'Not So Satisfied', 'Unsatisfied'],
    ['Not at All', 'Mostly Not', 'Generally Not', 'Sometimes', 'Always'],
    ['Not at All', 'Not Much', 'Normal', 'Usually', 'Very Much'],
    ['Completely Satisfied', 'Somewhat Satisfied', 'Always', 'Some Dissatisfied', 'Total Dissatisfied'],
    ['Like Very Much', 'Mostly Like', 'Generally Like', 'Seldom Like', 'Never Like'],
    ['Very Good', 'Good', 'Normal', 'Not Good', 'Unsatisfactory'],
    ['Always', 'Usually', 'Normally', 'No', 'Not at All'],
    ['Very Good', 'Good', 'Average', 'Weak', 'Feeble'],
    ['Always Present', 'Usually Present', 'Average', 'Generally Absent', 'Usually Absent'],
    ['Fully Satisfied', 'Satisfied', 'Somewhat Satisfied', 'Usually Dissatisfied', 'Totally Dissatisfied'],
    ['Always', 'Usually', 'Normally', 'Seldom', 'Never'],
    ['Always', 'Usually', 'Generally', 'Seldom', 'Never'],
    ['Always Speak Truth', 'Usually Speak Truth', 'Generally Speak Truth', 'Usually Speak Lie', 'Always Speak Lie'],
    ['Always', 'Usually', 'Generally', 'Seldom', 'Never'],
    ['Certainly', 'Usually', 'Generally', 'Less', 'Not at All'],
    ['Always', 'Usually', 'Generally', 'Seldom', 'Never'],
    ['Always Solve Yourself', 'Usually Solve Yourself', 'Before Solving Consult Others', 'Usually Do Not Solve Yourself', 'Always Depend on Others'],
    ['Most Often', 'Often', 'Give Attention', 'Do Not Give Attention', 'Do Not Attend At All'],
    ['Will start immediately', 'Will go after thinking for sometime', 'Will keep silent', 'Will not go after thinking for sometime', 'Will refuse at once'],
    ['Will never do such thing', 'Do not have the courage to do in spite of will', 'Generally do not do this', 'Will use the book if get an opportunity', 'Will immediately use the book'],
    ['Shall take water', 'Will take water after some consideration', 'Will care for cleanliness', 'Will take water but would tell nobody', 'Will not take water'],
    ['Do not hesitate at all', 'Sometimes hesitate', 'Generally do not hesitate', 'Usually hesitate', 'Always hesitate'],
    ['Will wait for the next bus', 'Will request the conductor', 'Will run and try to board the bus', 'Will push other passengers and try to board the bus', 'Will make a noise'],
    ['Will completely break the friendship', 'Will lessen the friendship', 'Will continue friendship but will try to make him understand', 'Will continue friendship as it was', 'Will strengthen the friendship'],
    ['Will call the doctor to show the sick brother', 'Will prepare for going out', 'Will read the novel', 'Will go to see the friend', 'Will not do any of the above mentioned work'],
    ['Will return one hundred rupees to the friend at once', 'Will tell the friend at once', 'Will return ₹1100 while returning them', 'If the friend does not come to know, will take out one hundred rupees if possible', 'Shall take out one hundred rupees'],
    ['Always do the work keeping in mind the desire of others', 'Usually do the work keeping in mind the desires of others', 'Generally do the work keeping in mind the desires of others', 'Sometimes do not care for the liking of others', "Always do according to one's will"],
]

# ---------------------------------------------------------------------------
# GWBS -- 55 questions, one shared option set
# Section boundaries (question_no ranges), matching GWBS_DIMENSIONS in
# services/quiz_scoring.py exactly: A=1-11, B=12-25, C=26-42, D=43-55
# ---------------------------------------------------------------------------

GWBS_QUESTIONS = [
    'I feel healthy, energetic, and active.',
    'I do regular physical exercise.',
    'Meditation is a part of my daily routine.',
    'I eat a well-balanced and nutritious diet.',
    'I consider myself good-looking.',
    'I have several healthy habits, e.g., healthy eating habits, sleeping on time, wearing neat and clean clothes, and avoiding smoking and drugs.',
    'I feel sleepy all the time.',
    'My mouth emits a bad smell all the time.',
    'Most of the time, I feel tired.',
    'I spend time on my interests and hobbies.',
    'I like my daily routine.',
    'My emotions get hurt easily.',
    'I get worried about petty things.',
    'I often feel aggrieved.',
    'Nobody knows how unhappy I am.',
    'My mind remains puzzled all the time.',
    'Sometimes, I wish to commit suicide.',
    'Sometimes, I feel disgusted with myself.',
    'Most of the time, I feel restless.',
    'Most of the time, I do not take an interest in any task.',
    'I am impatient, selfish, and get bored easily.',
    'I am a cheerful boy/girl.',
    'I am confident and independent in my decisions.',
    'I am alert and able to cope with stress.',
    'I share my feelings with my close friends.',
    'I enjoy being with others.',
    'I enjoy attending parties.',
    'I make friends easily.',
    'I have many friends.',
    'I am liked by my classmates.',
    'Most of the time, my friends agree with me.',
    'I enjoy the companionship of my friends at functions.',
    'I participate in volunteer activities.',
    'My friends and family trust me.',
    'I enjoy the beauty of nature.',
    'I make the best use of my time.',
    'I am happy with my life.',
    'I usually feel alone most of the time.',
    'Sometimes, I feel that nobody likes me.',
    'I often feel alone at parties and picnics.',
    'I like to be alone rather than being with my friends.',
    'I express my views without hesitation in the presence of others.',
    'The school environment seems uninteresting to me.',
    'I feel lonely at school.',
    'I feel depressed while doing classwork.',
    'I feel like crying during school hours.',
    'I feel burdened by my studies.',
    'I feel that my school teachers do not pay attention to my problems.',
    'My classmates often make fun of me.',
    'I do not participate in most of the events organised by the school.',
    'I like going to school.',
    'I am interested in most of the subjects taught in my class.',
    'My teachers are ready to solve my difficulties.',
    'I never hesitate to state my views in class.',
    'I usually complete my homework on the same day.',
]

# Assign score_value 1,2,3,4,5 in this display order (Strongly Disagree=1
# ... Strongly Agree=5). Reversal for negatively-worded items is handled
# in services/quiz_scoring.py's score_GWBS(), not here.
GWBS_OPTIONS = [
    'Strongly Disagree',
    'Disagree',
    'Undecided',
    'Agree',
    'Strongly Agree',
]

# ---------------------------------------------------------------------------
# TABBPS -- 17 Form A + 16 Form B questions, one shared option set
# ---------------------------------------------------------------------------

TABBPS_FORM_A_QUESTIONS = [
    'I prefer to move around rapidly when I am not doing anything.',
    'I prefer to finish the tasks at hand as soon as possible.',
    'I am never late if I have an appointment.',
    'I tend to feel impatient with the rate at which most events take place.',
    'I have very few interests outside my work.',
    "I feel impatient when I don't have any work in hand.",
    'I always feel rushed.',
    'I am in the habit of having quick meals.',
    'Competition is my first choice.',
    'I enjoy doing two or more things simultaneously.',
    'Quantity is a measure of success for me.',
    'I cannot relax without guilt.',
    'I have always been struggling to achieve more in less time.',
    'I am very particular about exhibiting my superiority whenever I play.',
    'I have always lived a life of deadlines.',
    'I take it as a privilege to display or discuss my achievements or accomplishments whenever I get an opportunity to do so.',
    'I have never found sufficient time for the task at hand.',
]

TABBPS_FORM_B_QUESTIONS = [
    'I do not work under time pressure.',
    'I do not display or discuss either my achievements or accomplishments unless such exposure is demanded by the situation.',
    'I have never set deadlines for my accomplishments.',
    'I play for fun and relaxation.',
    'I relax whenever I want to.',
    'I do not give much weight to quantity in comparison to other measures of success.',
    'I prefer to concentrate on one task at a time.',
    'I enjoy my food without haste.',
    'I never feel rushed.',
    'Leisure time is welcome after a spell of work.',
    'I am open in expressing my feelings.',
    'I have many interests outside my work.',
    'I am comfortable with the rate at which most events take place.',
    'I take appointments casually.',
    'I prefer to complete the tasks at hand slowly.',
    'I prefer to sit in one place when I am not doing anything.',
]

# Assign score_value 5,4,3,2,1 in this display order (Strongly Agree=5
# ... Strongly Disagree=1) -- agreement scores high for these Type-A-
# leaning statements, matching how services/quiz_scoring.py sums them.
TABBPS_OPTIONS = [
    'Strongly Agree',
    'Agree',
    'Uncertain',
    'Disagree',
    'Strongly Disagree',
]

# ---------------------------------------------------------------------------
# EI -- 50 questions, one shared option set
# ---------------------------------------------------------------------------

EI_QUESTIONS = [
    'I realise immediately when I lose my temper.',
    "I can 'reframe' bad situations quickly.",
    'I am able to always motivate myself to do difficult tasks.',
    "I am always able to see things from the other person's viewpoint.",
    'I am an excellent listener.',
    'I know when I am happy.',
    "I do not wear my 'heart on my sleeve'.",
    'I am usually able to prioritise important activities at work and get on with them.',
    "I am excellent at empathising with someone else's problems.",
    "I never interrupt other people's conversations.",
    'I usually recognise when I am stressed.',
    'Others can rarely tell what kind of mood I am in.',
    'I always meet deadlines.',
    'I can tell if someone is not happy with me.',
    'I am good at adapting and mixing with a variety of people.',
    "When I am being 'emotional', I am aware of this.",
    "I rarely 'fly off the handle' at other people.",
    'I never waste time.',
    'I can tell if a team of people is not getting along with each other.',
    'People are the most interesting thing in life to me.',
    'When I feel anxious, I can usually account for the reason(s).',
    'Difficult people do not annoy me.',
    'I do not prevaricate.',
    'I can usually understand why people are being difficult towards me.',
    "I love to meet new people and get to know what makes them 'tick'.",
    "I always know when I'm being unreasonable.",
    'I can consciously alter my frame of mind or mood.',
    'I believe you should do the difficult things first.',
    "Other individuals are not 'difficult', just 'different'.",
    'I need a variety of work colleagues to make my job interesting.',
    'Awareness of my own emotions is very important to me at all times.',
    'I do not let stressful situations or people affect me once I have left work.',
    'Delayed gratification is a virtue that I hold dear.',
    'I can understand if I am being unreasonable.',
    'I like to ask questions to find out what is important to people.',
    'I can tell if someone has upset or annoyed me.',
    'I rarely worry about work or life in general.',
    "I believe in 'Action this Day'.",
    'I can understand why my actions sometimes offend others.',
    'I see working with difficult people as simply a challenge to win them over.',
    "I can let anger 'go' quickly so that it no longer affects me.",
    'I can suppress my emotions when I need to.',
    'I can always motivate myself even when I feel low.',
    "I can sometimes see things from others' point of view.",
    'I am good at reconciling differences with other people.',
    'I know what makes me happy.',
    'Others often do not know how I am feeling about things.',
    'Motivation has been the key to my success.',
    'The reasons for disagreements are always clear to me.',
    'I generally build solid relationships with those I work with.',
]

# Assign score_value 1,2,3,4,5 in this display order.
EI_OPTIONS = [
    'Does not apply',
    'Applies a little',
    'Applies about half the time',
    'Applies often',
    'Always applies',
]