import React from 'react';
import PropTypes from 'prop-types';
import {Emitter} from 'event-kit';

import {WorkdirContextPoolPropType} from '../prop-types';
import {autobind} from '../helpers';
import ChangedFileContainer from '../containers/changed-file-container';

export default class ChangedFileItem extends React.Component {
  static propTypes = {
    workdirContextPool: WorkdirContextPoolPropType.isRequired,

    relPath: PropTypes.string.isRequired,
    workingDirectory: PropTypes.string.isRequired,
    stagingStatus: PropTypes.oneOf(['staged', 'unstaged']),

    workspace: PropTypes.object.isRequired,
    commands: PropTypes.object.isRequired,
    keymaps: PropTypes.object.isRequired,
    tooltips: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,

    discardLines: PropTypes.func.isRequired,
    undoLastDiscard: PropTypes.func.isRequired,
    surfaceFileAtPath: PropTypes.func.isRequired,
  }

  static uriPattern = 'atom-github://file-patch/{relPath...}?workdir={workingDirectory}&stagingStatus={stagingStatus}'

  static buildURI(relPath, workingDirectory, stagingStatus) {
    return 'atom-github://file-patch/' +
      encodeURIComponent(relPath) +
      `?workdir=${encodeURIComponent(workingDirectory)}` +
      `&stagingStatus=${encodeURIComponent(stagingStatus)}`;
  }

  constructor(props) {
    super(props);
    autobind(this, 'destroy');

    this.emitter = new Emitter();
    this.isDestroyed = false;
    this.hasTerminatedPendingState = false;
  }

  getTitle() {
    let title = this.props.stagingStatus === 'staged' ? 'Staged' : 'Unstaged';
    title += ' Changes: ';
    title += this.props.relPath;
    return title;
  }

  terminatePendingState() {
    if (!this.hasTerminatedPendingState) {
      this.emitter.emit('did-terminate-pending-state');
      this.hasTerminatedPendingState = true;
    }
  }

  onDidTerminatePendingState(callback) {
    return this.emitter.on('did-terminate-pending-state', callback);
  }

  destroy() {
    /* istanbul ignore else */
    if (!this.isDestroyed) {
      this.emitter.emit('did-destroy');
      this.isDestroyed = true;
    }
  }

  onDidDestroy(callback) {
    return this.emitter.on('did-destroy', callback);
  }

  render() {
    const repository = this.props.workdirContextPool.getContext(this.props.workingDirectory).getRepository();

    return (
      <ChangedFileContainer
        itemType={this.constructor}
        repository={repository}
        destroy={this.destroy}
        {...this.props}
      />
    );
  }

  serialize() {
    return {
      deserializer: 'FilePatchControllerStub',
      uri: ChangedFileItem.buildURI(this.props.relPath, this.props.workingDirectory, this.props.stagingStatus),
    };
  }

  getStagingStatus() {
    return this.props.stagingStatus;
  }

  getFilePath() {
    return this.props.relPath;
  }

  getWorkingDirectory() {
    return this.props.workingDirectory;
  }

  isFilePatchItem() {
    return true;
  }
}
