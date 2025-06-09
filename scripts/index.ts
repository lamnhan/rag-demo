import 'dotenv/config';
import mri from 'mri';

import { runDownloadCommand } from './commands/download.js';
import { runInsertCommand } from './commands/insert.js';
import { runSetupCommand } from './commands/setup.js';

(async () => {
  const args = mri(process.argv.slice(2));
  const command = args._[0];

  switch (command) {
    case 'download': {
      await runDownloadCommand();
      break;
    }
    case 'setup': {
      await runSetupCommand();
      break;
    }
    case 'insert': {
      await runInsertCommand();
      break;
    }
    default: {
      console.error(`Unknown command: ${command}\n`);
      process.exit(1);
    }
  }
})();
