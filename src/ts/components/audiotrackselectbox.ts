import {SelectBox} from './selectbox';
import {ListSelectorConfig} from './listselector';
import {UIInstanceManager} from '../uimanager';

/**
 * A select box providing a selection between available audio tracks (e.g. different languages).
 */
export class AudioTrackSelectBox extends SelectBox {

  constructor(config: ListSelectorConfig = {}) {
    super(config);
  }

  configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let self = this;

    let updateAudioTracks = function() {
      let audioTracks = player.getAvailableAudio();

      self.clearItems();

      // Add audio tracks
      for (let audioTrack of audioTracks) {
        self.addItem(audioTrack.id, audioTrack.label);
      }
    };

    self.onItemSelected.subscribe(function(sender: AudioTrackSelectBox, value: string) {
      player.setAudio(value);
    });

    let audioTrackHandler = function() {
      let currentAudioTrack = player.getAudio();
      self.selectItem(currentAudioTrack.id);
    };

    // Update selection when selected track has changed
    player.addEventHandler(player.EVENT.ON_AUDIO_CHANGED, audioTrackHandler);
    // Update tracks when source goes away
    player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, updateAudioTracks);
    // Update tracks when a new source is loaded
    player.addEventHandler(player.EVENT.ON_READY, updateAudioTracks);

    // Populate tracks at startup
    updateAudioTracks();
  }
}