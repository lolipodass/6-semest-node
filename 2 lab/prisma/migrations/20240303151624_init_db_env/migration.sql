-- CreateTable
CREATE TABLE "Faculty" (
    "faculty" VARCHAR(15) NOT NULL,
    "faculty_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("faculty")
);

-- CreateTable
CREATE TABLE "Pulpit" (
    "pulpit" VARCHAR(15) NOT NULL,
    "pulpit_name" VARCHAR(255) NOT NULL,
    "faculty_id" VARCHAR NOT NULL,

    CONSTRAINT "Pulpit_pkey" PRIMARY KEY ("pulpit")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "teacher" VARCHAR(15) NOT NULL,
    "teacher_name" VARCHAR(255) NOT NULL,
    "pulpit_id" VARCHAR(15) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("teacher")
);

-- CreateTable
CREATE TABLE "Subject" (
    "subject" VARCHAR(15) NOT NULL,
    "subject_name" VARCHAR(255) NOT NULL,
    "pulpit_id" VARCHAR(15) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("subject")
);

-- CreateTable
CREATE TABLE "Auditorium_Type" (
    "auditorium_type" VARCHAR(15) NOT NULL,
    "auditorium_typename" VARCHAR(255) NOT NULL,

    CONSTRAINT "Auditorium_Type_pkey" PRIMARY KEY ("auditorium_type")
);

-- CreateTable
CREATE TABLE "Auditorium" (
    "auditorium" VARCHAR(15) NOT NULL,
    "auditorium_name" VARCHAR(255) NOT NULL,
    "auditorium_capacity" INTEGER NOT NULL,
    "auditorium_type_id" VARCHAR(15) NOT NULL,

    CONSTRAINT "Auditorium_pkey" PRIMARY KEY ("auditorium")
);

-- AddForeignKey
ALTER TABLE "Pulpit" ADD CONSTRAINT "Pulpit_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("faculty") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_pulpit_id_fkey" FOREIGN KEY ("pulpit_id") REFERENCES "Pulpit"("pulpit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_pulpit_id_fkey" FOREIGN KEY ("pulpit_id") REFERENCES "Pulpit"("pulpit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditorium" ADD CONSTRAINT "Auditorium_auditorium_type_id_fkey" FOREIGN KEY ("auditorium_type_id") REFERENCES "Auditorium_Type"("auditorium_type") ON DELETE RESTRICT ON UPDATE CASCADE;
