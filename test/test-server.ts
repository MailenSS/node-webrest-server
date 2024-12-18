import { envs } from "../src/config/envs";
import { AppRoutes } from "../src/presentation/routes";
import { Server } from "../src/presentation/server";


// Para poseer un server de pruebas donde probar
export const testServer = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
})