(this["webpackJsonpreact-frontend"]=this["webpackJsonpreact-frontend"]||[]).push([[0],{108:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(9),c=a.n(l),i=(a(85),a(65)),s=a(27),o=a(61),u=a(37),m=a(38),d=a(44),b=a(39),p=a(45),h=a(149),E=a(155),f=a(158),v=a(150),g=a(47),O=a.n(g),j=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(d.a)(this,Object(b.a)(t).call(this,e))).state={usernameText:"Email Address",passwordText:"Password"},a}return Object(p.a)(t,e),Object(m.a)(t,[{key:"makeTextField",value:function(e){return r.a.createElement(E.a,{id:"outlined-basic",label:e,variant:"outlined"})}},{key:"encryptedPassword",value:function(){return this.state.passwordText}},{key:"submitCredentials",value:function(){O.a.post("http://localhost:4010/testing",{username:"username",password:"password"}).then((function(e){return console.log(e)}))}},{key:"changePages",value:function(){O.a.get("http://localhost:4010/testing").then((function(e){return console.log(e)}))}},{key:"render",value:function(){return r.a.createElement("div",null,this.makeTextField(this.state.usernameText),this.makeTextField(this.state.passwordText),r.a.createElement(f.a,Object(o.a)({value:"primary",inputProps:{"aria-label":"secondary checkbox"}},"value","Remember me")),r.a.createElement(h.a,{onClick:this.submitCredentials,variant:"secondary"},"Sign In"),r.a.createElement(v.a,{onClick:this.changePages},"Forgot Password?"))}}]),t}(r.a.Component),x=a(68),k=a(69),w=a(151),y=a(152),T=a(157),C=a(154),I=a(110),P=a(156),F=a(153),J=function(e){function t(e){return Object(u.a)(this,t),Object(d.a)(this,Object(b.a)(t).call(this,e))}return Object(p.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){function e(e){var t=e.children,a=e.value,n=e.index,l=Object(k.a)(e,["children","value","index"]);return r.a.createElement(I.a,Object.assign({component:"div",role:"tabpanel",hidden:a!==n,id:"simple-tabpanel-".concat(n),"aria-labelledby":"simple-tab-".concat(n)},l),a===n&&r.a.createElement(P.a,{p:3},t))}function t(e){return{id:"simple-tab-".concat(e),"aria-controls":"simple-tabpanel-".concat(e)}}var a=Object(w.a)((function(e){return{root:{flexGrow:1,backgroundColor:e.palette.background.paper}}}))(),n=r.a.useState(0),l=Object(x.a)(n,2),c=l[0],i=l[1];return r.a.createElement("div",{className:a.root},r.a.createElement(y.a,{position:"static"},r.a.createElement(F.a,null,r.a.createElement(T.a,{value:c,onChange:function(e,t){i(t)},"aria-label":"simple tabs example"},r.a.createElement(C.a,Object.assign({label:"Models"},t(0))),r.a.createElement(C.a,Object.assign({label:"Instances"},t(1))),r.a.createElement(C.a,Object.assign({label:"Users"},t(2)))),r.a.createElement(h.a,{color:"inherit"},"Login"))),r.a.createElement(e,{value:c,index:0},"Item One"),r.a.createElement(e,{value:c,index:1},"Item Two"),r.a.createElement(e,{value:c,index:2},"Item Three"))}}]),t}(r.a.Component);c.a.render(r.a.createElement((function(){return r.a.createElement(i.a,null,r.a.createElement(s.c,null,r.a.createElement(s.a,{path:"/"},r.a.createElement(j,null)),r.a.createElement(s.a,{path:"/homepage"},r.a.createElement(J,null))))}),null),document.getElementById("root"))},80:function(e,t,a){e.exports=a(108)},85:function(e,t,a){}},[[80,1,2]]]);
//# sourceMappingURL=main.6643bf27.chunk.js.map
