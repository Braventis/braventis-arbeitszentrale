const NOTION_VERSION="2025-09-03";
const token=process.env.NOTION_TOKEN;
export const notionConfigured=Boolean(token);

async function request(path:string,init:RequestInit={}){
  if(!token) throw new Error("NOTION_TOKEN fehlt");
  const res=await fetch(`https://api.notion.com/v1${path}`,{
    ...init,
    headers:{
      Authorization:`Bearer ${token}`,
      "Notion-Version":NOTION_VERSION,
      "Content-Type":"application/json",
      ...(init.headers||{})
    },
    cache:"no-store"
  });
  if(!res.ok) throw new Error(`Notion ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function queryDataSource(id:string,body:Record<string,unknown>={}){
  return request(`/data_sources/${id}/query`,{method:"POST",body:JSON.stringify({page_size:50,...body})});
}

export async function createDataSourcePage(id:string,properties:Record<string,unknown>,children?:unknown[]){
  return request("/pages",{method:"POST",body:JSON.stringify({parent:{type:"data_source_id",data_source_id:id},properties,...(children?{children}:{})})});
}

export async function updateDataSourcePage(id:string,properties:Record<string,unknown>){
  return request(`/pages/${id}`,{method:"PATCH",body:JSON.stringify({properties})});
}

export async function trashDataSourcePage(id:string){
  return request(`/pages/${id}`,{method:"PATCH",body:JSON.stringify({in_trash:true})});
}

export function plain(prop:any):string{
  if(!prop)return"";
  if(prop.type==="title")return prop.title?.map((x:any)=>x.plain_text).join("")||"";
  if(prop.type==="rich_text")return prop.rich_text?.map((x:any)=>x.plain_text).join("")||"";
  if(prop.type==="select")return prop.select?.name||"";
  if(prop.type==="status")return prop.status?.name||"";
  if(prop.type==="date")return prop.date?.start||"";
  if(prop.type==="number")return String(prop.number??"");
  return"";
}
