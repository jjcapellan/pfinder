(()=>{var s=new Map,g=1e3;function d(r,i,h){return{x:r,y:i,parent:null,children:[],isWall:h,g:0,h:0,f:0}}function m(r){let i=r.length,h=r[0].length,t=[];for(let e=0;e<h;e++){let n=new Array(i).fill(0);n.forEach((c,l)=>{n[l]=d(l,e,r[e][l])}),t.push(n)}for(let e=0;e<h;e++){let n=t[e];n.forEach((c,l)=>{let u=[],o=!1,f=!1,a=!1,p=!1;l>0&&(u.push(n[l-1]),a=!0),l<i-1&&(u.push(n[l+1]),p=!0),e>0&&(u.push(t[e-1][l]),o=!0),e<h-1&&(u.push(t[e+1][l]),f=!0),o&&a&&u.push(t[e-1][l-1]),o&&p&&u.push(t[e-1][l+1]),f&&a&&u.push(t[e+1][l-1]),f&&p&&u.push(t[e+1][l+1]),t[e][l].children=u})}return t}function P(r,i,h){let t=[],e=r;for(;e&&(t.push({x:e.x,y:e.y}),!(e.x==i&&e.y==h));)e=e.parent;return t.reverse()}function k(r,i,h){let t=Math.abs(r.x-i),e=Math.abs(r.y-h);return 10*(t+e)-5.857*Math.min(t,e)}function M(r,i,h,t,e){s.size>g&&s.delete(s.keys().next().value);let n=i+"."+h+"."+t+"."+e;s.set(n,r)}function w(r,i,h,t,e){if(r[h][i].isWall||r[e][t].isWall)return null;let n=[],c=[];for(n.push(r[h][i]);n.length;){let l=n[0],u=0;if(n.forEach((f,a)=>{f.f<l.f&&(l=f,u=a)}),n.splice(u,1),c.push(l),l.x==t&&l.y==e)return P(l,i,h);l.children.forEach(f=>{if(f.isWall||c.includes(f))return;let a=l.g+1;f.g<a&&(f.parent=l,f.g=a,f.f=a+k(f,t,e),n.includes(f)||n.push(f))})}return null}function W(r,i,h,t,e){if(r[h][i].isWall||r[e][t].isWall)return null;let n=s.get(i+"."+h+"."+t+"."+e);return n!==void 0||(n=w(r,i,h,t,e),M(n,i,h,t,e)),n}function b(r){g=r}typeof window<"u"&&(globalThis.Pfinder={getPath:w,getPathFromCache:W,makeGrid:m,setMaxCacheSize:b});})();
