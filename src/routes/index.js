import { AppLayout } from "../layout/app/AppLayout.jsx";
import { LoginLayout } from "../layout/auth/LoginLayout.jsx";
import { RegisterLayout } from "../layout/auth/RegisterLayout.jsx";
import { Login } from "../pages/auth/Login.jsx";
import { Register } from "../pages/auth/Register.jsx";
import { Home } from "../pages/home/Home.jsx";
import { CreateClass } from "../pages/teacher/class/CreateClass.jsx";
import { ClassSetting } from "../pages/teacher/class/ClassSetting.jsx";
import { ClassQuizzes } from "../pages/teacher/class/ClassQuizzes.jsx";
import { ListClasses } from "../pages/teacher/class/ListClasses.jsx";
import { ClassMembers } from "../pages/teacher/class/members/ClassMembers.jsx";
import { Teacher } from "../pages/teacher/class/members/Teacher.jsx";
import { Student } from "../pages/teacher/class/members/Student.jsx";
import { CreateQuiz } from "../pages/teacher/class/quizzes/CreateQuiz.jsx";
import { UpdateQuiz } from "../pages/teacher/quizzes/EditQuiz.jsx";
import { StudentAnswers } from "../pages/teacher/student-answers/StudentAnswers.jsx";
import { UserInfo } from "../pages/user/UserInfo.jsx";
import { ListClass } from "../pages/student/class/ListClass.jsx";
import { ExamList } from "../pages/student/quiz/ExamList.jsx";
import { DoQuiz } from "../pages/student/quiz/DoQuiz.jsx";

export const publicRoutes = [
    // home
    { path: "/", component: Home, layout: AppLayout },

    // auth
    { path: "/login", component: Login, layout: LoginLayout },
    { path: "/register", component: Register, layout: RegisterLayout },

    //user
    { path: "/user", component: UserInfo, layout: AppLayout },

    // student
    { path: "/student/home", component: Home, layout: AppLayout },
    { path: "/student/classes", component: ListClass, layout: AppLayout },
    { path: "/student/classes/:id/quizzes", component: ExamList, layout: AppLayout },
    { path: "/student/quizzes/:id", component: DoQuiz, layout: AppLayout },
    { path: "student/classes/:id/student-answers", component: null, layout: AppLayout },

    // teacher
    { path: "/teacher/home", component: Home, layout: AppLayout },

    { path: "/teacher/create-class", component: CreateClass, layout: null },
    { path: "/teacher/classes", component: ListClasses, layout: AppLayout },
    { path: "/teacher/classes/:id/members", component: ClassMembers, layout: AppLayout },
    { path: "/teacher/classes/:id/members/teacher", component: Teacher, layout: AppLayout },
    { path: "/teacher/classes/:id/members/student", component: Student, layout: AppLayout },
    { path: "/teacher/classes/:id/quizzes", component: ClassQuizzes, layout: AppLayout },
    // { path: "/teacher/classes/:id/quizzes/:id", component: UpdateQuiz, layout: AppLayout },
    { path: "/teacher/classes/:id/settings", component: ClassSetting, layout: AppLayout },

    { path: "/teacher/create-quiz", component: CreateQuiz, layout: null },
    { path: "/teacher/quizzes/", component: null, layout: AppLayout },
    { path: "/teacher/quizzes/:id/edit", component: UpdateQuiz, layout: null },

    { path: "teacher/student-answers/:id", component: StudentAnswers, layout: AppLayout },
];
