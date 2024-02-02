import defaultConfig from "./defaultConfig.json";

function initStorage() {
  localStorage.setItem("config", JSON.stringify({ ...defaultConfig, ...(JSON.parse(localStorage.getItem("config")||"{}")) }));
}

export default initStorage;
