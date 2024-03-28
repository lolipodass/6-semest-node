-- DropForeignKey
ALTER TABLE "Auditorium" DROP CONSTRAINT "Auditorium_auditorium_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Pulpit" DROP CONSTRAINT "Pulpit_faculty_id_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_pulpit_id_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_pulpit_id_fkey";

-- AddForeignKey
ALTER TABLE "Pulpit" ADD CONSTRAINT "Pulpit_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("faculty") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_pulpit_id_fkey" FOREIGN KEY ("pulpit_id") REFERENCES "Pulpit"("pulpit") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_pulpit_id_fkey" FOREIGN KEY ("pulpit_id") REFERENCES "Pulpit"("pulpit") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditorium" ADD CONSTRAINT "Auditorium_auditorium_type_id_fkey" FOREIGN KEY ("auditorium_type_id") REFERENCES "Auditorium_Type"("auditorium_type") ON DELETE CASCADE ON UPDATE CASCADE;
