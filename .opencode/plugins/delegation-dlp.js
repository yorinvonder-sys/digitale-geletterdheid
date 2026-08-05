import {
  resolveExternalRoute,
  validateExternalMessage,
} from '../../scripts/agent-runtime/external-delegation-dlp.mjs';

export const DelegationDlp = async () => ({
  'chat.message': async (input, output) => {
    const agent = input.agent ?? '';
    const model = input.model?.modelID ?? '';
    const route = resolveExternalRoute(agent, model);

    if (route) {
      const packet = validateExternalMessage(route, output.parts);
      output.parts = [{ ...output.parts[0], type: 'text', text: packet }];
    }
  },
});
