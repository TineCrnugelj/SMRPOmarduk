import axios from "axios";
import { StoryData } from "../../classes/storyData";
import { getBaseUrl } from "../../helpers/helpers";


const STORY_API_URL = `${getBaseUrl()}/api/story`;

// const STORY_API_URL = `http://localhost:3000/api/story`;

const getAllStory = async (token: string) => {
    const config = {
        headers: {
            Authorization: `JWT ${token}`
        }
    }

    const response = await axios.get(`${STORY_API_URL}`, config);

    return response.data;
}

const deleteStory = async (storyId: string, token: string) => {
    const config = {
        headers: {
            Authorization: `JWT ${token}`
        }
    }
    const response = await axios.delete(`${STORY_API_URL}/${storyId}`, config);

    return response.data;
}

const storyService = {
    getAllStory,
    deleteStory
}

export default storyService;
