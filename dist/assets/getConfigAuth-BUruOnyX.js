const e=()=>{let e=null;try{e=JSON.parse(localStorage.getItem("token"))}catch(t){}return{headers:{...e&&{Authorization:`Bearer ${e}`}}}};export{e as g};
