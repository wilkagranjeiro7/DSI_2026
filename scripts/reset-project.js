#!/usr/bin/env node

class NodeDependencies {
  static fs = require("fs");
  static path = require("path");
  static readline = require("readline");
}

class ResetProjectTemplate {
  static indexContent() {
    return `import { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

export default class Index extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Edit src/app/index.tsx to edit this screen.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
`;
  }

  static layoutContent() {
    return `import { Stack } from "expo-router";
import { Component } from "react";

export default class RootLayout extends Component {
  render() {
    return <Stack />;
  }
}
`;
  }
}

class ProjectResetter {
  constructor(rootDirectory) {
    this.root = rootDirectory;
    this.oldDirs = ["src", "scripts"];
    this.exampleDir = "example";
    this.newAppDir = "src/app";
    this.exampleDirPath = NodeDependencies.path.join(
      this.root,
      this.exampleDir,
    );
  }

  async run(userInput) {
    try {
      if (userInput === "y") {
        await NodeDependencies.fs.promises.mkdir(this.exampleDirPath, {
          recursive: true,
        });
        console.log(`/${this.exampleDir} directory created.`);
      }

      await this.moveOrDeleteOldDirectories(userInput);
      await this.createFreshAppDirectory();
      this.printSuccess(userInput);
    } catch (error) {
      console.error(`Error during script execution: ${error.message}`);
    }
  }

  async moveOrDeleteOldDirectories(userInput) {
    for (const dir of this.oldDirs) {
      const oldDirPath = NodeDependencies.path.join(this.root, dir);

      if (!NodeDependencies.fs.existsSync(oldDirPath)) {
        console.log(`/${dir} does not exist, skipping.`);
        continue;
      }

      if (userInput === "y") {
        const newDirPath = NodeDependencies.path.join(
          this.root,
          this.exampleDir,
          dir,
        );
        await NodeDependencies.fs.promises.rename(oldDirPath, newDirPath);
        console.log(`/${dir} moved to /${this.exampleDir}/${dir}.`);
      } else {
        await NodeDependencies.fs.promises.rm(oldDirPath, {
          recursive: true,
          force: true,
        });
        console.log(`/${dir} deleted.`);
      }
    }
  }

  async createFreshAppDirectory() {
    const newAppDirPath = NodeDependencies.path.join(this.root, this.newAppDir);
    await NodeDependencies.fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\nNew /src/app directory created.");

    const indexPath = NodeDependencies.path.join(newAppDirPath, "index.tsx");
    await NodeDependencies.fs.promises.writeFile(
      indexPath,
      ResetProjectTemplate.indexContent(),
    );
    console.log("src/app/index.tsx created.");

    const layoutPath = NodeDependencies.path.join(newAppDirPath, "_layout.tsx");
    await NodeDependencies.fs.promises.writeFile(
      layoutPath,
      ResetProjectTemplate.layoutContent(),
    );
    console.log("src/app/_layout.tsx created.");
  }

  printSuccess(userInput) {
    console.log("\nProject reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit src/app/index.tsx to edit the main screen.\n3. Put all your application code in /src, only screens and layout files should be in /src/app.${
        userInput === "y"
          ? `\n4. Delete the /${this.exampleDir} directory when you're done referencing it.`
          : ""
      }`,
    );
  }
}

class ResetPrompt {
  constructor(resetter) {
    this.resetter = resetter;
    this.rl = NodeDependencies.readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  ask() {
    this.rl.question(
      "Do you want to move existing files to /example instead of deleting them? (Y/n): ",
      (answer) => this.handleAnswer(answer),
    );
  }

  handleAnswer(answer) {
    const userInput = answer.trim().toLowerCase() || "y";

    if (userInput === "y" || userInput === "n") {
      this.resetter.run(userInput).finally(() => this.rl.close());
      return;
    }

    console.log("Invalid input. Please enter 'Y' or 'N'.");
    this.rl.close();
  }
}

new ResetPrompt(new ProjectResetter(process.cwd())).ask();
