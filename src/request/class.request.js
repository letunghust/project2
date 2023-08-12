import { api } from "../utils/api.util.js";

export const getListClassesOfTeacher = async (params) => {
    const response = await api.get("teacher/classes", { params });
    return response.data;
};

export const getListClassesOfStudent = async () => {
    const { data } = await api.get("/student/classes");
    return data;
};

export const getClassOfTeacherById = async (id) => {
    const { data } = await api.get(`/teacher/classes/${id}`);
    return data;
};

export const getClassOftudentById = async (id) => {
    const { data } = await api.get(`/student/classes/${id}`);
    return data;
};

export const createClass = async (body) => {
    const { data } = await api.post("/teacher/classes", body);
    return data;
};

export const deleteClasses = async (ids) => {
    const { data } = await api.delete("/teacher/classes", { data: { ids } });
    return data;
};

export const leaveClasses = async (id) => {
    const { data } = await api.delete(`/student/classes/${id}`);
    return data;
};

export const getClassByID = async (id) =>{
    const response = await api.get(`teacher/classes/${id}`)
    return response.data
}

export const updateClass = async(id, body) =>{
    const response = await api.put(`teacher/classes/${id}`,{
        name: body.name,
        description: body.description,
        joinCode: body.joinCode,
        classNumber: body.classNumber,
        requirePermission: body.requirePermission,
    })
    console.log(response.data);
    return response.data;
} 
export const deleteClass = async(id,body) =>{
    const response = await api.delete(`teacher/classes/${id}`,{
       ids : body.ids
    })
    console.log(response.data);
    return response.data;
} 
