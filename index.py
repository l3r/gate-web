from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def documentViewer():
    return render_template('docView.html')
