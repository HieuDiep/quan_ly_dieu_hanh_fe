import roles from "../services/roles";
import user from "../services/user";
import approval from "../services/approval";
import users from "../services/users";
import propose from "../services/propose";
import signature from "../services/signature";
import categories from "../services/categories";
import template from "../services/template";
import task from "../services/task";

import todo from "../services/todo";
import axios from "axios";
const repository = (axios: any) => {
  return {
    roles: roles(axios),
    user: user(axios),
    users: users(axios),
    propose: propose(axios),
    signature: signature(axios),
    approval: approval(axios),
    categories: categories(axios),
    template: template(axios),
    task: task(axios),
    todo: todo(axios)
  };
};
const repo = repository(axios);
export default repo;
