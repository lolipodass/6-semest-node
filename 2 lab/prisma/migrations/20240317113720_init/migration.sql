-- CreateTable
CREATE TABLE "Faculty" (
    "faculty" TEXT NOT NULL PRIMARY KEY,
    "faculty_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pulpit" (
    "pulpit" TEXT NOT NULL PRIMARY KEY,
    "pulpit_name" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    CONSTRAINT "Pulpit_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty" ("faculty") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Teacher" (
    "teacher" TEXT NOT NULL PRIMARY KEY,
    "teacher_name" TEXT NOT NULL,
    "pulpit_id" TEXT NOT NULL,
    CONSTRAINT "Teacher_pulpit_id_fkey" FOREIGN KEY ("pulpit_id") REFERENCES "Pulpit" ("pulpit") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subject" (
    "subject" TEXT NOT NULL PRIMARY KEY,
    "subject_name" TEXT NOT NULL,
    "pulpit_id" TEXT NOT NULL,
    CONSTRAINT "Subject_pulpit_id_fkey" FOREIGN KEY ("pulpit_id") REFERENCES "Pulpit" ("pulpit") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Auditorium_Type" (
    "auditorium_type" TEXT NOT NULL PRIMARY KEY,
    "auditorium_typename" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Auditorium" (
    "auditorium" TEXT NOT NULL PRIMARY KEY,
    "auditorium_name" TEXT NOT NULL,
    "auditorium_capacity" INTEGER NOT NULL,
    "auditorium_type_id" TEXT NOT NULL,
    CONSTRAINT "Auditorium_auditorium_type_id_fkey" FOREIGN KEY ("auditorium_type_id") REFERENCES "Auditorium_Type" ("auditorium_type") ON DELETE CASCADE ON UPDATE CASCADE
);
