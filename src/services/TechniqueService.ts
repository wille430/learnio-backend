import ProjectService from "./ProjectService";

export default class TechniqueService extends ProjectService {
    techniqueId: string

    constructor(userId, projectId, techniqueId) {
        super(userId, projectId)
        this.techniqueId = techniqueId
    }

    async delete(): Promise<void> {
        const user = await this.user()

        for (const [key, value] of Object.entries(user.projects.id(this.projectId).techniques)) {
            user.projects.id(this.projectId).techniques[key].pull(this.techniqueId)
        }

        await this.saveUser(user)
    }
}