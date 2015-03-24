var invalidRegex = new Regex(/(a+){10}/g);
var invalidRegex = /(x+x+)+y/g;

app.use(express.csrf());
app.use(express.methodOverride());

var password = "SuperSecret";
if (password === "SuperSecret") {
	console.log('password is correct');
}
