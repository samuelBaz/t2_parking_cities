export const basicModel = `
[request_definition]
r = sub, obj, act, exp

[policy_definition]
p = sub, obj, act, eft, app, exp

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny)) 

[matchers]
m = (r.sub == p.sub || p.sub == "*") && keyMatch2(r.obj, p.obj) && regexMatch(r.act, p.act) && (r.exp <= p.exp || !p.exp || p.exp=='')
`
export const basicPolicy = `g, admin, ADMINISTRADOR`
