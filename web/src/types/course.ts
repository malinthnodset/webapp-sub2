// TypeScript types that mirror the C# DTOs in the API.
// ASP.NET sends JSON in camelCase, so C# "CourseCode" becomes "courseCode" here.
// If someone changes a DTO in the API, change the type here too.

// Matches C#: public class CourseDto { int Id; string Code; string Name; }
export interface CourseDto {
  id: number;
  code: string;
  name: string;
}

// What we send when creating or updating a course (no id — the server/URL decides that)
// Matches C#: public class CreateCourseDto { string Code; string Name; }
export interface CreateCourseDto {
  code: string;
  name: string;
}
