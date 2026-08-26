// src/services/api/students/index.ts

// تصدير جميع الدوال والأنواع
export { createStudent } from './createStudent';
export type { CreateStudentData } from './createStudent';

export { updateStudent } from './updateStudent';
export type { UpdateStudentData } from './updateStudent';

export { deleteStudent } from './deleteStudent';

export { getStudent } from './getStudent';
export type { Student as StudentDetails, StudentResponse } from './getStudent';

export { getStudents } from './getStudents';
export type { Student as StudentList, StudentsListResponse } from './getStudents';

export { getParentsList } from './get-parents-list';
export type { ParentList } from './get-parents-list';

export { getSectionsList } from './get-sections-list';
export type { SectionList } from './get-sections-list';

export { getClassesList } from './get-classes-list';
export type { ClassList } from './get-classes-list';

export { getStudentsByClass } from './get-students-by-class';

export { getStudentsBySection } from './get-students-by-section';

export { getStudentsStatistics } from './get-students-count';
export type { StudentStatistics } from './get-students-count';

export { searchStudents } from './search-students';