import axios from "axios";
import { ProjectData, ProjectDataEdit } from "../../classes/projectData";
import { getBaseUrl } from "../../helpers/helpers";


const PROJECTS_API_URL = `${getBaseUrl()}/api/project`;
// const PROJECTS_API_URL = `http://localhost:3000/api/project`;


const updateProjectRoles = async (projectRoleData: any, token: string) => {
    const config = {
        headers: {
            Authorization: `JWT ${token}`
        }
    }

    let roleToChange = projectRoleData.role;
    let projectID = projectRoleData.projectId;
    // console.log("BEFORE CALL: ", projectData)

    const response = await axios.patch(`${PROJECTS_API_URL}/${projectID}/change-user/role/${roleToChange}`, {newUserId: projectRoleData.userId}, config);
    return response.data;
}

const addDeveloper = async (addDeveloperData: any, token: string) => {
    const config = {
        headers: {
            Authorization: `JWT ${token}`
        }
    }

    let userId = addDeveloperData.userId;
    let projectID = addDeveloperData.projectId;

    const response = await axios.post(`${PROJECTS_API_URL}/${projectID}/developer/${userId}`, '', config);

    return response.data;
}

const removeDeveloper = async (removeDeveloperData: any, token: string) => {
    const config = {
        headers: {
            Authorization: `JWT ${token}`
        }
    }

    let userId = removeDeveloperData.userId;
    let projectID = removeDeveloperData.projectId;

    const response = await axios.delete(`${PROJECTS_API_URL}/${projectID}/developer/${userId}`, config);

    return response.data;
}
const getProjectUserRoles = async (id: string, token: string) => {
    const config = {
        headers: {
            Authorization: `JWT ${token}`
        }
    }
    const response = await axios.get(`${PROJECTS_API_URL}/${id}/user`, config);

    return response.data;
}


const projectRoleService = {
    updateProjectRoles,
    addDeveloper,
    removeDeveloper,
    getProjectUserRoles
}

export default projectRoleService;
