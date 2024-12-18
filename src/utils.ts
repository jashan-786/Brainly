export function random(len:number){
let options="qwertyuiopsadjkl12345678"
let ans= ""

for(let i=0; i< len ; i++)
ans+=options[Math.floor(Math.random()* options.length)] // 0 =>20

return ans
}

