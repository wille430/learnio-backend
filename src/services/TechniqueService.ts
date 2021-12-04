import ProjectService from "./ProjectService";

export default class TechniqueService extends ProjectService {
    techniqueId: string

    constructor(userId, project_id, techniqueId) {
        super(userId, project_id)
        this.techniqueId = techniqueId
    }

    async delete(): Promise<void> {
        const user = await this.user()

        for (const [key, value] of Object.entries(user.projects.id(this.project_id).techniques)) {
            user.projects.id(this.project_id).techniques[key].pull(this.techniqueId)
        }

        await this.saveUser(user)
    }
}