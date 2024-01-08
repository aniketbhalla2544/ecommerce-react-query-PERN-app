import { State } from '@stores/zustand/zustand.store';
import { act } from 'react-dom/test-utils';

const mockInitialAppState: State = {
  accessToken: 'asdjflasjfdlj.sdlfjsjafdljalfjlasfd.lsdjflsajfljsdlf',
  vendor: {
    id: '23',
    email: 'testuser@gmail.com',
    vendorSlug: 'testuser_slug',
    fullname: 'test user',
    isPremium: false,
  },
  deleteModalState: {
    showModal: false,
    showSpinner: false,
    contentText: '',
    modalHeading: '',
  },
};
