import {NextRequest,NextResponse} from "next/server";
import {createDataSourcePage,getDataSourcePage,notionConfigured,trashDataSourcePage,updateDataSourcePage} from "@/lib/notion";

const STATUSES=["Idee","Backlog","To-do","In Bearbeitung","Freigabe / Review","Abgeschlossen"];
const PRIORITIES=["Hoch","Mittel","Niedrig"];
const SOURCES=["Monatsplan","Kunde","Projekt","Aufgabenpool","Intern"];
const tasksId=process.env.NOTION_TASKS_DATA_SOURCE_ID;

function text(value:unknown){return String(value??"").trim();}
function allowed(value:unknown,values:string[],fallback:string){const candidate=text(value);return values.includes(candidate)?candidate:fallback;}
function validDate(value:unknown){const candidate=text(value);return /^\d{4}-\d{2}-\d{2}$/.test(candidate)?candidate:"";}
function ready(){return notionConfigured&&Boolean(tasksId);}
function properties(body:Record<string,unknown>,partial=false){
  const result:Record<string,unknown>={};
  if(!partial||body.title!==undefined){const title=text(body.title).slice(0,200);if(!title)throw new Error("Titel fehlt");result.Aufgabe={title:[{text:{content:title}}]};}
  if(!partial||body.status!==undefined)result.Status={status:{name:allowed(body.status,STATUSES,"To-do")}};
  if(!partial||body.priority!==undefined)result.Priorität={select:{name:allowed(body.priority,PRIORITIES,"Mittel")}};
  if(!partial||body.source!==undefined)result.Quelle={select:{name:allowed(body.source,SOURCES,"Intern")}};
  if(body.due!==undefined){const due=validDate(body.due);result.Fällig={date:due?{start:due}:null};}
  return result;
}
async function assertTaskPage(id:string){
  const page=await getDataSourcePage(id);
  if(page?.parent?.type!=="data_source_id"||page.parent.data_source_id!==tasksId)throw new Error("Diese Seite gehört nicht zur Aufgaben-Datenbank.");
}

export async function POST(req:NextRequest){
  if(!ready())return NextResponse.json({ok:false,demo:true,message:"Notion ist noch nicht vollständig verbunden."},{status:503});
  try{const body=await req.json();const page=await createDataSourcePage(tasksId!,properties(body));return NextResponse.json({ok:true,id:page.id});}
  catch(error){return NextResponse.json({ok:false,message:error instanceof Error?error.message:"Fehler"},{status:400});}
}

export async function PATCH(req:NextRequest){
  if(!ready())return NextResponse.json({ok:false,demo:true,message:"Notion ist noch nicht vollständig verbunden."},{status:503});
  try{const body=await req.json();const id=text(body.id);if(!id)return NextResponse.json({ok:false,message:"Aufgaben-ID fehlt"},{status:400});await assertTaskPage(id);await updateDataSourcePage(id,properties(body,true));return NextResponse.json({ok:true,id});}
  catch(error){return NextResponse.json({ok:false,message:error instanceof Error?error.message:"Fehler"},{status:400});}
}

export async function DELETE(req:NextRequest){
  if(!ready())return NextResponse.json({ok:false,demo:true,message:"Notion ist noch nicht vollständig verbunden."},{status:503});
  try{const body=await req.json();const id=text(body.id);if(!id)return NextResponse.json({ok:false,message:"Aufgaben-ID fehlt"},{status:400});await assertTaskPage(id);await trashDataSourcePage(id);return NextResponse.json({ok:true,id});}
  catch(error){return NextResponse.json({ok:false,message:error instanceof Error?error.message:"Fehler"},{status:400});}
}
