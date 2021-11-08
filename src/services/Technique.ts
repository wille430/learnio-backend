import ProjectService from "./ProjectService";

export default class Technique extends ProjectService {
    techniqueId: string

    constructor(userId, projectId, techniqueId) {
        super(userId, projectId)
        this.techniqueId = techniqueId
    }
}