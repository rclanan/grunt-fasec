var invalidRegex = /(a+){10}/g;
var invalidRegex2 = /(x+x+)+y/g;

var app, express;

app.use(express.csrf());
app.use(express.methodOverride());

var password = 'SuperSecret';
if (password === 'SuperSecret') {
	console.log('password is correct');
}

if (invalidRegex === invalidRegex2) {
	console.log('I am here to satisfy the linter!');
}
