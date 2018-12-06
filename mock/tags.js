import { parse } from 'url';

let tagsList = [
  {id: 0, tagname: "React", color:"#f50", creater: {username: "artorias"}, createtime: new Date(), updatetime: new Date()},
  {id: 1, tagname: "Go", color:"#2db7f5", creater: {username: "artorias"}, createtime: new Date(), updatetime: new Date()},
  {id: 2, tagname: "MongoDB", color:"#87d068", creater: {username: "artorias"}, createtime: new Date(), updatetime: new Date()},
  {id: 3, tagname: "Redis", color:"#108ee9", creater: {username: "artorias"}, createtime: new Date(), updatetime: new Date()},
  {id: 4, tagname: "Node", color:"#108", creater: {username: "artorias"}, createtime: new Date(), updatetime: new Date()}
]
let SerializatialId = 5
function getTags(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  const result = {
    code: 1,
    message: "查询成功",
    data: tagsList,
  }
  return res.json(result);
}
function postTags(req, res, u, b){
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
      tagsList = tagsList.filter(item => {
        if(params.id instanceof Array) {
          return params.id.indexOf(item.id) === -1
        }
        return params.id !== item.id
      });
      result = {
        code: 1,
        message: "删除成功",
        data: {
          list: tagsList,
          pagination: {
            total: tagsList.length,
          },
        }
      };
      break;
    case 'post':
      params.id = SerializatialId
      params.creater = {username: "artorias"}
      SerializatialId += 1
      tagsList.push(params)
      result = {
        code: 1,
        message: "添加分类成功",
        data: {
          list: tagsList,
          pagination: {
            total: tagsList.length,
          },
        }
      }
      break;
    case 'update':
    tagsList.forEach((elem) => {
        if(elem.id === params.id) {
         Object.assign(elem, params)
        }
      })
      result = {
        code: 1,
        message: "更新分类成功",
        data: {
          list: tagsList,
          pagination: {
            total: tagsList.length,
          },
        }
      }
      break;
    case 'query':
      let queryCategoryList = tagsList
      if(params && params.catename){
        queryCategoryList = tagsList.filter(item => params.catename === item.catename);
      }
      result = {
        code: 1,
        message: "更新分类成功",
        data: {
          list: queryCategoryList,
          pagination: {
            total: tagsList.length,
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
  'GET /api/tags': getTags,
  'POST /api/tags': postTags
}
