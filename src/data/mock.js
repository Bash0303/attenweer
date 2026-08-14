export const school = {
  name: 'Witty Group of Schools',
  shortName: 'WGS',
  secondaryName: 'Witty Secondary School',
  location: 'Basin Road, Beside NHIS, Ilorin, Kwara State',
  phones: ['0802 104 1132', '0810 894 4151'],
  email: 'wittyacademy@gmail.com',
  motto: 'Success in Both Worlds',
  mottoArabic: 'الفلاح في الدارين',
  mottoArabicPlain: 'Al-Falah fi al-Darayn',
  mission:
    'To empower children of all academic and moral backgrounds through tailored guidance, while equipping parents and guardians with the counselling they need to support them.',
  vision:
    'To be a trendsetter in providing lifelong moral and academic solutions for learners of every age.',
  uniform: { shirt: 'Cream', trouser: 'Navy Blue' },
  session: '2025/2026',
  term: 'First Term',
  tagline: 'Nurturing excellence in knowledge, faith and character',
  established: 2023,
}

export const coreValues = [
  { title: 'Iman (Faith)', ar: 'إيمان', icon: 'star', desc: 'A firm foundation of Islamic faith and values guiding every learner.' },
  { title: 'Academic Excellence', ar: 'التميّز', icon: 'book', desc: 'Relentless pursuit of knowledge across modern and traditional curricula.' },
  { title: 'Moral Integrity', ar: 'الأخلاق', icon: 'shield', desc: 'Character building anchored on honesty, respect and responsibility.' },
  { title: 'Discipline', ar: 'الانضباط', icon: 'target', desc: 'Order, punctuality and self-control as habits of daily life.' },
]

export const classes = [
  { id: 'c1', name: 'JSS 1A', level: 'JSS 1', arm: 'A', classTeacher: 'Mrs. Halima Yusuf', studentCount: 34, capacity: 40, subjects: ['Mathematics', 'English Language', 'Basic Science', 'Basic Technology', 'Computer Studies', 'Civic Education', 'Social Studies', 'Business Studies', 'Islamic Studies', 'Arabic'] },
  { id: 'c2', name: 'JSS 1B', level: 'JSS 1', arm: 'B', classTeacher: 'Mr. Adewale Ogunleye', studentCount: 32, capacity: 40 },
  { id: 'c3', name: 'JSS 2A', level: 'JSS 2', arm: 'A', classTeacher: 'Mrs. Grace Emmanuel', studentCount: 36, capacity: 40 },
  { id: 'c4', name: 'JSS 2B', level: 'JSS 2', arm: 'B', classTeacher: 'Mr. Tunde Bakare', studentCount: 30, capacity: 40 },
  { id: 'c5', name: 'JSS 3A', level: 'JSS 3', arm: 'A', classTeacher: 'Mrs. Fatima Abdul', studentCount: 35, capacity: 40 },
  { id: 'c6', name: 'JSS 3B', level: 'JSS 3', arm: 'B', classTeacher: 'Mr. Samuel Ojo', studentCount: 33, capacity: 40 },
  { id: 'c7', name: 'SS 1A', level: 'SS 1', arm: 'A', classTeacher: 'Mrs. Amina Suleiman', studentCount: 31, capacity: 40 },
  { id: 'c8', name: 'SS 1B', level: 'SS 1', arm: 'B', classTeacher: 'Mr. David Okon', studentCount: 29, capacity: 40 },
  { id: 'c9', name: 'SS 2A', level: 'SS 2', arm: 'A', classTeacher: 'Mrs. Ramat Ibrahim', studentCount: 34, capacity: 40 },
  { id: 'c10', name: 'SS 2B', level: 'SS 2', arm: 'B', classTeacher: 'Mr. Femi Ajayi', studentCount: 32, capacity: 40 },
  { id: 'c11', name: 'SS 3A', level: 'SS 3', arm: 'A', classTeacher: 'Mr. Ismail Bello', studentCount: 38, capacity: 40 },
  { id: 'c12', name: 'SS 3B', level: 'SS 3', arm: 'B', classTeacher: 'Mrs. Zainab Yusuf', studentCount: 36, capacity: 40 },
]

export const subjects = [
  { id: 's1', name: 'Mathematics', code: 'MTH', category: 'Core', level: 'All', teacherId: 't1' },
  { id: 's2', name: 'English Language', code: 'ENG', category: 'Core', level: 'All', teacherId: 't2' },
  { id: 's3', name: 'Basic Science', code: 'BSC', category: 'Core', level: 'Junior', teacherId: 't3' },
  { id: 's4', name: 'Basic Technology', code: 'BTE', category: 'Core', level: 'Junior', teacherId: 't4' },
  { id: 's5', name: 'Computer Studies', code: 'CSC', category: 'Core', level: 'All', teacherId: 't5' },
  { id: 's6', name: 'Civic Education', code: 'CVE', category: 'Core', level: 'Junior', teacherId: 't6' },
  { id: 's7', name: 'Social Studies', code: 'SOS', category: 'Core', level: 'Junior', teacherId: 't7' },
  { id: 's8', name: 'Business Studies', code: 'BUS', category: 'Core', level: 'Junior', teacherId: 't8' },
  { id: 's9', name: 'Islamic Studies', code: 'IRS', category: 'Moral', level: 'All', teacherId: 't9' },
  { id: 's10', name: 'Arabic Language', code: 'ARB', category: 'Moral', level: 'All', teacherId: 't10' },
  { id: 's11', name: 'Biology', code: 'BIO', category: 'Science', level: 'Senior', teacherId: 't11' },
  { id: 's12', name: 'Chemistry', code: 'CHM', category: 'Science', level: 'Senior', teacherId: 't12' },
  { id: 's13', name: 'Physics', code: 'PHY', category: 'Science', level: 'Senior', teacherId: 't13' },
  { id: 's14', name: 'Economics', code: 'ECO', category: 'Commercial', level: 'Senior', teacherId: 't14' },
  { id: 's15', name: 'Government', code: 'GOV', category: 'Arts', level: 'Senior', teacherId: 't15' },
  { id: 's16', name: 'Literature in English', code: 'LIT', category: 'Arts', level: 'Senior', teacherId: 't16' },
  { id: 's17', name: 'Further Mathematics', code: 'FMT', category: 'Science', level: 'Senior', teacherId: 't17' },
  { id: 's18', name: 'CRS', code: 'CRS', category: 'Moral', level: 'All', teacherId: 't18' },
]

export const teachers = [
  { id: 't1', name: 'Mr. Ismail Bello', staffId: 'WGS/T/001', gender: 'Male', phone: '08031122334', email: 'ismail.bello@wittyacademy.com', qualification: 'B.Sc. Mathematics, M.Ed', dept: 'Sciences', subjects: ['Mathematics'], classTeacher: 'SS 3A', status: 'Active', color: 'bg-navy-600', initials: 'IB' },
  { id: 't2', name: 'Mrs. Ramat Ibrahim', staffId: 'WGS/T/002', gender: 'Female', phone: '08045566778', email: 'ramat.ibrahim@wittyacademy.com', qualification: 'B.A. English', dept: 'Arts', subjects: ['English Language'], classTeacher: 'SS 2A', status: 'Active', color: 'bg-emerald-600', initials: 'RI' },
  { id: 't3', name: 'Mrs. Halima Yusuf', staffId: 'WGS/T/003', gender: 'Female', phone: '08089911223', email: 'halima.yusuf@wittyacademy.com', qualification: 'B.Sc. Biology', dept: 'Sciences', subjects: ['Basic Science', 'Biology'], classTeacher: 'JSS 1A', status: 'Active', color: 'bg-gold-500', initials: 'HY' },
  { id: 't4', name: 'Mr. Adewale Ogunleye', staffId: 'WGS/T/004', gender: 'Male', phone: '08055667788', email: 'adewale.ogunleye@wittyacademy.com', qualification: 'B.Eng. Mechanical', dept: 'Technology', subjects: ['Basic Technology'], classTeacher: 'JSS 1B', status: 'Active', color: 'bg-sky-600', initials: 'AO' },
  { id: 't5', name: 'Mrs. Grace Emmanuel', staffId: 'WGS/T/005', gender: 'Female', phone: '08022334455', email: 'grace.emmanuel@wittyacademy.com', qualification: 'B.Sc. Computer Science', dept: 'Technology', subjects: ['Computer Studies'], classTeacher: 'JSS 2A', status: 'Active', color: 'bg-violet-600', initials: 'GE' },
  { id: 't6', name: 'Mr. Tunde Bakare', staffId: 'WGS/T/006', gender: 'Male', phone: '08077889900', email: 'tunde.bakare@wittyacademy.com', qualification: 'B.A. History', dept: 'Arts', subjects: ['Civic Education', 'Government'], classTeacher: 'JSS 2B', status: 'Active', color: 'bg-rose-600', initials: 'TB' },
  { id: 't7', name: 'Mrs. Fatima Abdul', staffId: 'WGS/T/007', gender: 'Female', phone: '08099001122', email: 'fatima.abdul@wittyacademy.com', qualification: 'B.Sc. Sociology', dept: 'Arts', subjects: ['Social Studies'], classTeacher: 'JSS 3A', status: 'Active', color: 'bg-amber-600', initials: 'FA' },
  { id: 't8', name: 'Mr. Samuel Ojo', staffId: 'WGS/T/008', gender: 'Male', phone: '08066778899', email: 'samuel.ojo@wittyacademy.com', qualification: 'B.Sc. Accounting', dept: 'Commercial', subjects: ['Business Studies', 'Economics'], classTeacher: 'JSS 3B', status: 'Active', color: 'bg-cyan-600', initials: 'SO' },
  { id: 't9', name: 'Sheikh Aminu Salawu', staffId: 'WGS/T/009', gender: 'Male', phone: '08033445566', email: 'aminu.salawu@wittyacademy.com', qualification: 'B.A. Arabic & Islamic Studies', dept: 'Islamic', subjects: ['Islamic Studies'], classTeacher: '—', status: 'Active', color: 'bg-teal-700', initials: 'AS' },
  { id: 't10', name: 'Ustaz Umar Farouk', staffId: 'WGS/T/010', gender: 'Male', phone: '08011223344', email: 'umar.farouk@wittyacademy.com', qualification: 'B.A. Arabic', dept: 'Islamic', subjects: ['Arabic Language'], classTeacher: '—', status: 'Active', color: 'bg-indigo-600', initials: 'UF' },
  { id: 't11', name: 'Mrs. Amina Suleiman', staffId: 'WGS/T/011', gender: 'Female', phone: '08044556677', email: 'amina.suleiman@wittyacademy.com', qualification: 'B.Sc. Biology', dept: 'Sciences', subjects: ['Biology'], classTeacher: 'SS 1A', status: 'Active', color: 'bg-lime-600', initials: 'AS' },
  { id: 't12', name: 'Mr. David Okon', staffId: 'WGS/T/012', gender: 'Male', phone: '08055443322', email: 'david.okon@wittyacademy.com', qualification: 'B.Sc. Chemistry', dept: 'Sciences', subjects: ['Chemistry'], classTeacher: 'SS 1B', status: 'Active', color: 'bg-fuchsia-600', initials: 'DO' },
  { id: 't13', name: 'Mr. Femi Ajayi', staffId: 'WGS/T/013', gender: 'Male', phone: '08088776655', email: 'femi.ajayi@wittyacademy.com', qualification: 'B.Sc. Physics', dept: 'Sciences', subjects: ['Physics', 'Further Mathematics'], classTeacher: 'SS 2B', status: 'Active', color: 'bg-slate-700', initials: 'FA' },
  { id: 't14', name: 'Mrs. Zainab Yusuf', staffId: 'WGS/T/014', gender: 'Female', phone: '08077665544', email: 'zainab.yusuf@wittyacademy.com', qualification: 'B.Sc. Economics', dept: 'Commercial', subjects: ['Economics'], classTeacher: 'SS 3B', status: 'Active', color: 'bg-orange-600', initials: 'ZY' },
  { id: 't15', name: 'Mr. John Adeyemi', staffId: 'WGS/T/015', gender: 'Male', phone: '08066554433', email: 'john.adeyemi@wittyacademy.com', qualification: 'B.A. Political Science', dept: 'Arts', subjects: ['Government'], classTeacher: '—', status: 'On Leave', color: 'bg-pink-600', initials: 'JA' },
  { id: 't16', name: 'Miss Mary Ekpo', staffId: 'WGS/T/016', gender: 'Female', phone: '08011223355', email: 'mary.ekpo@wittyacademy.com', qualification: 'B.A. English Literature', dept: 'Arts', subjects: ['Literature in English'], classTeacher: '—', status: 'Active', color: 'bg-purple-600', initials: 'ME' },
  { id: 't17', name: 'Mrs. Sikirat Balogun', staffId: 'WGS/T/017', gender: 'Female', phone: '08099887766', email: 'sikirat.balogun@wittyacademy.com', qualification: 'B.Sc. Statistics', dept: 'Sciences', subjects: ['Further Mathematics'], classTeacher: '—', status: 'Active', color: 'bg-red-600', initials: 'SB' },
  { id: 't18', name: 'Rev. Solomon Peters', staffId: 'WGS/T/018', gender: 'Male', phone: '08088776644', email: 'solomon.peters@wittyacademy.com', qualification: 'B.Th. Christian Religious Studies', dept: 'Arts', subjects: ['CRS'], classTeacher: '—', status: 'Active', color: 'bg-blue-700', initials: 'SP' },
]

const g = (name, opts) => ({
  id: opts.id,
  name,
  studentId: opts.studentId,
  gender: opts.gender,
  dob: opts.dob,
  classId: opts.classId,
  className: opts.className,
  parent: { name: opts.parentName, phone: opts.parentPhone },
  phone: opts.phone,
  email: opts.email,
  house: opts.house,
  admission: opts.admission,
  session: school.session,
  status: opts.status || 'Active',
  initials: opts.initials,
  color: opts.color,
})

export const students = [
  g('Abdullahi Jimoh', { id: 'stu1', studentId: 'WGS/2025/00101', gender: 'Male', dob: '15/04/2010', classId: 'c9', className: 'SS 2A', parentName: 'Mr. Abdullahi Jimoh Snr.', parentPhone: '08011111111', phone: '08011111112', email: 'abdullahi.jimoh@wittystudent.com', house: 'Red House', admission: '2021/2022', status: 'Active', initials: 'AJ', color: 'bg-navy-600' }),
  g('Maryam Adeleke', { id: 'stu2', studentId: 'WGS/2025/00102', gender: 'Female', dob: '22/09/2011', classId: 'c9', className: 'SS 2A', parentName: 'Mrs. Jane Adeleke', parentPhone: '08022222222', phone: '08022222223', email: 'maryam.adeleke@wittystudent.com', house: 'Blue House', admission: '2021/2022', status: 'Active', initials: 'MA', color: 'bg-emerald-600' }),
  g('Majeed Olawale', { id: 'stu3', studentId: 'WGS/2025/00103', gender: 'Male', dob: '03/03/2011', classId: 'c9', className: 'SS 2A', parentName: 'Mr. Majeed Olawale Snr.', parentPhone: '08033333333', phone: '08033333334', email: 'majeed.olawale@wittystudent.com', house: 'Red House', admission: '2020/2021', status: 'Active', initials: 'MO', color: 'bg-gold-500' }),
  g('Aminah Kolawole', { id: 'stu4', studentId: 'WGS/2025/00104', gender: 'Female', dob: '11/07/2011', classId: 'c9', className: 'SS 2A', parentName: 'Mr. James Kolawole', parentPhone: '08044444444', phone: '08044444445', email: 'aminah.kolawole@wittystudent.com', house: 'Blue House', admission: '2022/2023', status: 'Active', initials: 'AK', color: 'bg-sky-600' }),
  g('Aisha Mohammed', { id: 'stu5', studentId: 'WGS/2025/00105', gender: 'Female', dob: '19/12/2010', classId: 'c9', className: 'SS 2A', parentName: 'Alhaji Mohammed Saliu', parentPhone: '08055555555', phone: '08055555556', email: 'aisha.mohammed@wittystudent.com', house: 'Green House', admission: '2021/2022', status: 'Active', initials: 'AM', color: 'bg-violet-600' }),
  g('Ibrahim Yusuf', { id: 'stu6', studentId: 'WGS/2025/00106', gender: 'Male', dob: '27/01/2011', classId: 'c9', className: 'SS 2A', parentName: 'Mr. Yusuf Alabi', parentPhone: '08066666666', phone: '08066666667', email: 'ibrahim.yusuf@wittystudent.com', house: 'Green House', admission: '2019/2020', status: 'Active', initials: 'IY', color: 'bg-teal-700' }),
  g('Rukayat Okafor', { id: 'stu7', studentId: 'WGS/2025/00107', gender: 'Female', dob: '05/06/2011', classId: 'c9', className: 'SS 2A', parentName: 'Mrs. Okafor Ngozi', parentPhone: '08077777777', phone: '08077777778', email: 'rukayat.okafor@wittystudent.com', house: 'Red House', admission: '2022/2023', status: 'Suspended', initials: 'RO', color: 'bg-rose-600' }),
  g('Abdulhakeem Obi', { id: 'stu8', studentId: 'WGS/2025/00108', gender: 'Male', dob: '08/10/2010', classId: 'c9', className: 'SS 2A', parentName: 'Chief Obi Okonkwo', parentPhone: '08088888888', phone: '08088888889', email: 'abdulhakeem.obi@wittystudent.com', house: 'Blue House', admission: '2020/2021', status: 'Active', initials: 'AO', color: 'bg-indigo-600' }),
  g('Zainab Bello', { id: 'stu9', studentId: 'WGS/2025/00109', gender: 'Female', dob: '14/03/2011', classId: 'c9', className: 'SS 2A', parentName: 'Alhaja Bello Sadiat', parentPhone: '08099999999', phone: '08099999990', email: 'zainab.bello@wittystudent.com', house: 'Green House', admission: '2021/2022', status: 'Active', initials: 'ZB', color: 'bg-amber-600' }),
  g('Uthman Adeyemi', { id: 'stu10', studentId: 'WGS/2025/00110', gender: 'Male', dob: '29/05/2011', classId: 'c9', className: 'SS 2A', parentName: 'Mr. Adeyemi Uthman', parentPhone: '08101010101', phone: '08101010102', email: 'uthman.adeyemi@wittystudent.com', house: 'Red House', admission: '2022/2023', status: 'Active', initials: 'UA', color: 'bg-cyan-600' }),
]

export const guardians = [
  { id: 'p1', name: 'Mr. Abdullahi Jimoh Snr.', phone: '08011111111', email: 'abdullahijimoh@gmail.com', children: ['Abdullahi Jimoh'], relation: 'Father', occupation: 'Civil Servant' },
  { id: 'p2', name: 'Mrs. Jane Adeleke', phone: '08022222222', email: 'jane.adeleke@gmail.com', children: ['Maryam Adeleke', 'Abdulrahman Adeleke'], relation: 'Mother', occupation: 'Trader' },
  { id: 'p3', name: 'Mr. Majeed Olawale Snr.', phone: '08033333333', email: 'majeedolawale@gmail.com', children: ['Majeed Olawale'], relation: 'Father', occupation: 'Businessman' },
  { id: 'p4', name: 'Alhaji Mohammed Saliu', phone: '08055555555', email: 'mohsaliu@gmail.com', children: ['Aisha Mohammed', 'Musa Mohammed'], relation: 'Father', occupation: 'Alhaji / Business' },
]

const score = (ca1, ca2, exam) => {
  const total = ca1 + ca2 + exam
  let grade = 'F', point = 0
  if (total >= 75) { grade = 'A'; point = 5 } else if (total >= 70) { grade = 'B'; point = 4 } else if (total >= 60) { grade = 'C'; point = 3 } else if (total >= 50) { grade = 'D'; point = 2 } else if (total >= 45) { grade = 'E'; point = 1 }
  return { ca1, ca2, exam, total, grade, point }
}

export const resultData = {
  'SS 2A': [
    { subject: 'Mathematics', ...score(18, 17, 55) },
    { subject: 'English Language', ...score(16, 15, 48) },
    { subject: 'Physics', ...score(17, 16, 52) },
    { subject: 'Chemistry', ...score(19, 18, 56) },
    { subject: 'Biology', ...score(15, 14, 45) },
    { subject: 'Economics', ...score(14, 16, 47) },
    { subject: 'Computer Studies', ...score(18, 17, 53) },
    { subject: 'Islamic Studies', ...score(20, 18, 58) },
    { subject: 'Arabic Language', ...score(17, 16, 50) },
    { subject: 'Literature in English', ...score(13, 14, 42) },
    { subject: 'Civic Education', ...score(16, 15, 44) },
    { subject: 'Further Mathematics', ...score(14, 13, 40) },
  ],
  'SS 1A': [
    { subject: 'Mathematics', ...score(17, 16, 50) },
    { subject: 'English Language', ...score(15, 15, 46) },
    { subject: 'Biology', ...score(16, 15, 44) },
    { subject: 'Islamic Studies', ...score(19, 17, 55) },
  ],
}

export const resultSummary = (subjectRows) => {
  const rows = subjectRows
  const totalScore = rows.reduce((a, r) => a + r.total, 0)
  const count = rows.length
  const average = Math.round(totalScore / count)
  const best = rows.reduce((a, r) => (r.point > a.point ? r : a), rows[0])
  let remark = 'Pass'
  if (average >= 70) remark = 'Excellent'
  else if (average >= 60) remark = 'Very Good'
  else if (average >= 50) remark = 'Good'
  return { totalScore, count, average, best: best.subject, position: 4, remark }
}

export const attendanceData = {
  present: 18,
  absent: 1,
  late: 2,
  total: 21,
}

export const attendanceRate = Math.round((attendanceData.present + attendanceData.late) / attendanceData.total * 100)

export const feeStructure = {
  tuition: 150000,
  ict: 10000,
  development: 20000,
  exam: 5000,
}
export const totalFees = Object.values(feeStructure).reduce((a, b) => a + b, 0)

export const payments = [
  { id: 'PAY-1045', student: 'Abdullahi Jimoh', studentId: 'WGS/2025/00101', amount: 100000, purpose: 'Tuition', date: '12 Aug 2026', method: 'Bank Transfer', ref: 'TXN-88472', status: 'Verified' },
  { id: 'PAY-1046', student: 'Maryam Adeleke', studentId: 'WGS/2025/00102', amount: 50000, purpose: 'Tuition', date: '13 Aug 2026', method: 'Card', ref: 'TXN-88473', status: 'Verified' },
  { id: 'PAY-1047', student: 'Majeed Olawale', studentId: 'WGS/2025/00103', amount: 185000, purpose: 'Full Fees', date: '14 Aug 2026', method: 'Bank Transfer', ref: 'TXN-88474', status: 'Pending' },
  { id: 'PAY-1048', student: 'Aisha Mohammed', studentId: 'WGS/2025/00105', amount: 35000, purpose: 'Development Levy', date: '14 Aug 2026', method: 'POS', ref: 'TXN-88475', status: 'Verified' },
  { id: 'PAY-1049', student: 'Abdulhakeem Obi', studentId: 'WGS/2025/00108', amount: 20000, purpose: 'ICT Levy', date: '14 Aug 2026', method: 'Cash', ref: 'TXN-88476', status: 'Verified' },
  { id: 'PAY-1050', student: 'Aminah Kolawole', studentId: 'WGS/2025/00104', amount: 185000, purpose: 'Full Fees', date: '14 Aug 2026', method: 'Bank Transfer', ref: 'TXN-88477', status: 'Failed' },
]

export const announcements = [
  { id: 'a1', title: 'Resumption Date for Second Term', message: 'Students are expected to resume on Monday, 8th September 2026. Boarding students should return by 4:00pm.', audience: 'All Students', author: 'Principal', date: '14 Aug 2026', tag: 'Resumption', type: 'info' },
  { id: 'a2', title: 'First Term Examination Timetable Released', message: 'The First Term examination timetable for JSS and SS classes is now available on the portal.', audience: 'All Students & Parents', author: 'Academic Director', date: '13 Aug 2026', tag: 'Examination', type: 'exam' },
  { id: 'a3', title: 'Parents Teachers Association Meeting', message: 'PTA meeting holds on Saturday, 23rd August 2026 at the school assembly hall by 10:00am sharp.', audience: 'All Parents', author: 'PTA Chairman', date: '12 Aug 2026', tag: 'Meeting', type: 'meeting' },
  { id: 'a4', title: 'Fee Payment Reminder', message: 'This is a reminder to parents that the deadline for the payment of school fees is 30th September 2026.', audience: 'Parents of SS 3 Students', author: 'Bursar', date: '10 Aug 2026', tag: 'Fees', type: 'fees' },
  { id: 'a5', title: 'Inter-House Sports Competition', message: 'The annual inter-house sports competition will take place on Friday, 29th August 2026.', audience: 'All Students', author: 'Sports Director', date: '8 Aug 2026', tag: 'Sports', type: 'event' },
]

export const events = [
  { id: 'e1', title: 'First Term Examination Begins', date: '21 Sep 2026', type: 'exam', desc: 'All classes — First Term CA & Exam' },
  { id: 'e2', title: 'PTA Meeting', date: '23 Aug 2026', type: 'meeting', desc: 'Assembly hall, 10:00am' },
  { id: 'e3', title: 'Inter-House Sports', date: '29 Aug 2026', type: 'sports', desc: 'School sports field' },
  { id: 'e4', title: 'Islamic Knowledge Competition', date: '12 Sep 2026', type: 'islamic', desc: 'Surahs, Hadith & Tafseer' },
  { id: 'e5', title: 'Second Term Resumption', date: '8 Sep 2026', type: 'resumption', desc: 'All students resume 8:00am' },
]

export const timetable = [
  { time: '8:00 – 8:40', mon: 'Mathematics', tue: 'Physics', wed: 'English', thu: 'Chemistry', fri: 'Islamic Studies' },
  { time: '8:40 – 9:20', mon: 'English', tue: 'Chemistry', wed: 'Mathematics', thu: 'Physics', fri: 'Arabic' },
  { time: '9:20 – 9:50', mon: 'Break', tue: 'Break', wed: 'Break', thu: 'Break', fri: 'Break' },
  { time: '9:50 – 10:30', mon: 'Physics', tue: 'Mathematics', wed: 'Biology', thu: 'Economics', fri: 'Computer' },
  { time: '10:30 – 11:10', mon: 'Chemistry', tue: 'English', wed: 'Economics', thu: 'Further Maths', fri: 'Civic' },
  { time: '11:10 – 11:50', mon: 'Biology', tue: 'Computer', wed: 'Physics', thu: 'English', fri: 'Literature' },
  { time: '11:50 – 12:30', mon: 'Economics', tue: 'Further Maths', wed: 'Arabic', thu: 'Biology', fri: 'Sports' },
]

export const assignments = [
  { id: 'as1', title: 'Quadratic Equations', subject: 'Mathematics', className: 'SS 2A', teacher: 'Mr. Ismail Bello', desc: 'Solve questions 1–10 on pages 145–148 of your textbook and show all workings.', deadline: '20 Aug 2026', status: 'Open', submissions: 28, type: 'Open-ended' },
  { id: 'as2', title: 'Essay: My Role Model', subject: 'English Language', className: 'SS 2A', teacher: 'Mrs. Ramat Ibrahim', desc: 'Write an essay of not less than 300 words on "My Role Model".', deadline: '22 Aug 2026', status: 'Open', submissions: 21, type: 'Essay' },
  { id: 'as3', title: 'Atomic Structure', subject: 'Chemistry', className: 'SS 2A', teacher: 'Mr. David Okon', desc: 'Draw and label the atomic structure of first 10 elements.', deadline: '18 Aug 2026', status: 'Graded', submissions: 34, type: 'Project' },
  { id: 'as4', title: 'Hafiz Surah Al-Mulk (1-15)', subject: 'Islamic Studies', className: 'SS 2A', teacher: 'Sheikh Aminu Salawu', desc: 'Memorise verses 1–15 of Surah Al-Mulk with meaning.', deadline: '25 Aug 2026', status: 'Open', submissions: 19, type: 'Memorisation' },
  { id: 'as5', title: 'Market Equilibrium', subject: 'Economics', className: 'SS 2A', teacher: 'Mrs. Zainab Yusuf', desc: 'Explain market equilibrium using supply and demand curves.', deadline: '17 Aug 2026', status: 'Graded', submissions: 30, type: 'Essay' },
]

export const studentAssignments = [
  { id: 'sa1', title: 'Quadratic Equations', subject: 'Mathematics', teacher: 'Mr. Ismail Bello', deadline: '20 Aug 2026', status: 'Pending', score: null, desc: 'Solve questions 1–10 on pages 145–148 and show all workings.' },
  { id: 'sa2', title: 'Atomic Structure', subject: 'Chemistry', teacher: 'Mr. David Okon', deadline: '18 Aug 2026', status: 'Submitted', score: 17, desc: 'Draw and label the atomic structure of first 10 elements.' },
  { id: 'sa3', title: 'Market Equilibrium', subject: 'Economics', teacher: 'Mrs. Zainab Yusuf', deadline: '17 Aug 2026', status: 'Graded', score: 15, desc: 'Explain market equilibrium using supply and demand curves.' },
  { id: 'sa4', title: 'Hafiz Surah Al-Mulk (1-15)', subject: 'Islamic Studies', teacher: 'Sheikh Aminu Salawu', deadline: '25 Aug 2026', status: 'Pending', score: null, desc: 'Memorise verses 1–15 of Surah Al-Mulk with meaning.' },
]

export const announcementsForStudent = announcements.slice(0, 3).map(a => ({ ...a, read: a.id !== 'a2' }))

export const notifications = [
  { id: 'n1', title: 'New Assignment: Quadratic Equations', time: '2 hours ago', type: 'assignment', read: false, icon: 'clipboard' },
  { id: 'n2', title: 'First Term Result Published', time: 'Yesterday', type: 'result', read: false, icon: 'award' },
  { id: 'n3', title: 'Fee Payment Reminder', time: '2 days ago', type: 'fees', read: true, icon: 'wallet' },
  { id: 'n4', title: 'Attendance Alert: Marked Late', time: '3 days ago', type: 'attendance', read: true, icon: 'clock' },
  { id: 'n5', title: 'Examination Timetable Released', time: '1 week ago', type: 'exam', read: true, icon: 'calendar' },
]

export const messages = [
  { id: 'm1', from: 'Mr. Ismail Bello', role: 'Mathematics Teacher', text: 'Please ensure you attempt the assignment on quadratic equations before Friday.', time: '09:41', unread: true },
  { id: 'm2', from: 'Mrs. Ramat Ibrahim', role: 'English Teacher', text: 'Congratulations on your improvement in the last continuous assessment.', time: 'Yesterday', unread: false },
  { id: 'm3', from: 'School Admin', role: 'Administrator', text: 'Your school fees balance should be settled before the examination.', time: '2 days ago', unread: false },
]

export const feeBreakdownForStudent = [
  { label: 'Tuition', amount: feeStructure.tuition, paid: 100000 },
  { label: 'ICT Levy', amount: feeStructure.ict, paid: 0 },
  { label: 'Development Levy', amount: feeStructure.development, paid: 0 },
  { label: 'Examination Fee', amount: feeStructure.exam, paid: 0 },
]

export const paidSoFar = 100000
export const balanceOwed = totalFees - paidSoFar

export const classPopulation = classes.map(c => ({ name: c.name, students: c.studentCount }))

export const studentPopulationTrend = [
  { year: '2021/2022', students: 680, boys: 360, girls: 320 },
  { year: '2022/2023', students: 760, boys: 402, girls: 358 },
  { year: '2023/2024', students: 890, boys: 464, girls: 426 },
  { year: '2024/2025', students: 1020, boys: 528, girls: 492 },
  { year: '2025/2026', students: 1250, boys: 645, girls: 605 },
]

export const feeCollectionTrend = [
  { month: 'Mar', amount: 8.4 },
  { month: 'Apr', amount: 12.2 },
  { month: 'May', amount: 9.6 },
  { month: 'Jun', amount: 14.8 },
  { month: 'Jul', amount: 18.3 },
  { month: 'Aug', amount: 22.5 },
]

export const performanceTrend = [
  { term: '1st', average: 68 },
  { term: '2nd', average: 71 },
  { term: '3rd', average: 74 },
]

export const gradeDistribution = [
  { grade: 'A', count: 185 },
  { grade: 'B', count: 268 },
  { grade: 'C', count: 312 },
  { grade: 'D', count: 148 },
  { grade: 'E', count: 74 },
  { grade: 'F', count: 31 },
]

export const maleFemale = [
  { name: 'Male', value: 645, color: '#2a478e' },
  { name: 'Female', value: 605, color: '#d9a62e' },
]

export const recentApplications = [
  { id: 'APP-2301', name: 'Aisha Bello', className: 'JSS 1A', date: '14 Aug 2026', status: 'Pending' },
  { id: 'APP-2300', name: 'Musa Mohammed', className: 'SS 1A', date: '14 Aug 2026', status: 'Pending' },
  { id: 'APP-2299', name: 'Hafsat Adisa', className: 'JSS 2B', date: '13 Aug 2026', status: 'Approved' },
  { id: 'APP-2298', name: 'Khadijat Umar', className: 'SS 2B', date: '13 Aug 2026', status: 'Approved' },
  { id: 'APP-2297', name: 'Abdullahi Lawal', className: 'JSS 1A', date: '12 Aug 2026', status: 'Rejected' },
]

export const adminStats = {
  totalStudents: 1250,
  totalTeachers: 85,
  totalParents: 980,
  totalClasses: 42,
  attendanceToday: 94,
  outstandingFees: 1580000,
  feeCollectedThisMonth: 22500000,
  totalStaff: 98,
}

export const demoUsers = {
  admin: { email: 'admin@wittyacademy.com', password: 'admin123', name: 'Alhaji Abdul Kareem', role: 'Admin', initials: 'AK', color: 'bg-navy-700' },
  teacher: { email: 'teacher@wittyacademy.com', password: 'teacher123', name: 'Mrs. Ramat Ibrahim', role: 'Teacher', initials: 'RI', color: 'bg-emerald-600' },
  student: { email: 'student@wittyacademy.com', password: 'student123', name: 'Abdullahi Jimoh', role: 'Student', initials: 'AJ', color: 'bg-navy-600' },
  parent: { email: 'parent@wittyacademy.com', password: 'parent123', name: 'Mr. Abdullahi Jimoh Snr.', role: 'Parent', initials: 'AJ', color: 'bg-gold-500' },
}

export const staffAttendance = [
  { name: 'Mrs. Ramat Ibrahim', subject: 'English Language', className: 'SS 2A', present: 19, late: 1, absent: 1 },
  { name: 'Mr. Ismail Bello', subject: 'Mathematics', className: 'SS 3A', present: 20, late: 0, absent: 1 },
  { name: 'Mrs. Halima Yusuf', subject: 'Basic Science', className: 'JSS 1A', present: 18, late: 2, absent: 0 },
  { name: 'Mr. David Okon', subject: 'Chemistry', className: 'SS 1B', present: 17, late: 1, absent: 2 },
]

export const teacherClasses = [
  { id: 'c9', name: 'SS 2A', students: 34, timetable: 'Mon 8:40' },
  { id: 'c11', name: 'SS 3A', students: 38, timetable: 'Fri 8:00' },
]

export const teacherSubjects = ['English Language', 'Literature in English']
