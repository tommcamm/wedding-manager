import { error } from '@sveltejs/kit';
import invitesStore from '$lib/stores/mockInvites';
import guestsStore from '$lib/stores/mockGuests';
import settingsStore from '$lib/stores/mockSettings';

export const load = ({ params, url }: { params: { code: string }, url: URL }) => {
  const { code } = params;
  const lang = url.searchParams.get('lang') || 'en';
  
  // In a real app, this would be a database query
  const invite = invitesStore.getByCode(code);
  
  if (!invite) {
    throw error(404, 'Invitation not found');
  }
  
  // Get guests for this invite
  const guests = guestsStore.getByInviteId(invite.id);
  
  // Get wedding settings
  const settings = settingsStore;
  
  // Check if invitation is past deadline
  const isPastDeadline = invite.rsvpDeadline < new Date();
  
  return {
    invite,
    guests,
    settings,
    lang,
    isPastDeadline
  };
};
