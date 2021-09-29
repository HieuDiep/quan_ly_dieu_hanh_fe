import { nomalizeData } from "@/utils";

const departments = {
  namespaced: true,
  state: {
    byId: {},
  ids: []
  },
  mutations: {
    setAll(state: any, items: any) {
      const { byId, ids } = nomalizeData(items, 'id');
  
      state.byId = byId;
      state.ids = ids;
    }

  }
}
export default departments;