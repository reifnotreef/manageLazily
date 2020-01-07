import React from "react";
import { Route, Switch } from "react-router-dom";
import Project from "./routes/Project/Project";
import { FirebaseContext } from "./services";

function App() {
  return (
    <>
      <header className="app__header">
        <h1>Capstone App</h1>
      </header>
      <main className="app__main">
        <Switch>
          <Route path="/" component={Project} />
        </Switch>
      </main>
    </>
  );
}

export default App;
