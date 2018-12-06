import { parse } from 'url';

let categoryList = [
  {id: 0, catename: "React", creater: {username: "artorias"}, createtime: new Date(), updatetime: new Date()},
  {id: 1, catename: "Go", creater: {username: "artorias"}, createtime: new Date(), updatetime: new Date()},
  {id: 2, catename: "MongoDB", creater: {username: "artorias"}, createtime: new Date(), updatetime: new Date()},
  {id: 3, catename: "Redis", creater: {username: "artorias"}, createtime: new Date(), updatetime: new Date()}
]
let SerializatialId = 4
function getCategory(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  const result = {
    code: 1,
    message: "查询成功",
    data:{
      list: categoryList,
      pagination: {
        total: categoryList.length,
      }
    }
  }
  return res.json(result);
}

function postCategory(req, res, u, b){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, params} = body;
  let result = {};
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      categoryList = categoryList.filter(item => {
        if(params.id instanceof Array) {
          return params.id.indexOf(item.id) === -1
        }
        return params.id !== item.id
      });
      result = {
        code: 1,
        message: "删除成功",
        data: {
          list: categoryList,
          pagination: {
            total: categoryList.length,
          },
        }
      };
      break;
    case 'post':
      params.id = SerializatialId
      params.creater = {username: "artorias"}
      SerializatialId += 1
      categoryList.push(params)
      result = {
        code: 1,
        message: "添加分类成功",
        data: {
          list: categoryList,
          pagination: {
            total: categoryList.length,
          },
        }
      }
      break;
    case 'update':
      categoryList.forEach((elem) => {
        if(elem.id === params.id) {
         Object.assign(elem, params)
        }
      })
      result = {
        code: 1,
        message: "更新分类成功",
        data: {
          list: categoryList,
          pagination: {
            total: categoryList.length,
          },
        }
      }
      break;
    case 'query':
      let queryCategoryList = categoryList
      if(params && params.catename){
        queryCategoryList = categoryList.filter(item => params.catename === item.catename);
      }
      result = {
        code: 1,
        message: "更新分类成功",
        data: {
          list: queryCategoryList,
          pagination: {
            total: categoryList.length,
          },
        }
      }
      break;
    default:
      break;
  }
  return res.json(result);
}

export default {
  'GET /api/category': getCategory,
  'POST /api/category': postCategory
}
