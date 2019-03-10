import { AudioContext } from '../lib/three.module.js';
import * as DAT from '../lib/dat.gui.module.js';

/**
* Used to manage the state of the user interface.
*
* @author {@link https://github.com/Mugen87|Mugen87}
*/
class UIManager {

	/**
	* Constructs a new UI manager with the given values.
	*
	* @param {World} world - A reference to the world.
	*/
	constructor( world ) {

		this.world = world;

		this.uiElements = {
			crosshairs: null
		};

		this.debugParameter = {
			showRegions: true,
			showAxes: true,
			showPaths: true,
			showGraph: false,
			showSpawnPoints: false,
			showUUIDHelpers: false,
			showHitboxes: false,
			enableFPSControls: () => {

				this.world.fpsControls.connect();

			},
			resumeAudioContext: () => {

				const context = AudioContext.getContext();
				context.resume();

			}
		};

		//

		this._buildFPSInterface();

	}

	/**
	* Initializes the UI manager.
	*
	* @return {UIManager} A reference to this UI manager.
	*/
	init() {

		const world = this.world;

		if ( world.debug ) {

			const gui = new DAT.GUI( { width: 300 } );
			const params = this.debugParameter;

			// nav mesh folder

			const folderNavMesh = gui.addFolder( 'Navigation Mesh' );
			folderNavMesh.open();

			folderNavMesh.add( params, 'showRegions' ).name( 'show convex regions' ).onChange( ( value ) => {

				world.helpers.convexRegionHelper.visible = value;

			} );

			folderNavMesh.add( params, 'showPaths', 1, 30 ).name( 'show navigation paths' ).onChange( ( value ) => {

				for ( const pathHelper of world.helpers.pathHelpers ) {

					pathHelper.visible = value;

				}

			} );

			folderNavMesh.add( params, 'showGraph' ).name( 'show graph' ).onChange( ( value ) => {

				world.helpers.graphHelper.visible = value;

			} );

			// world folder

			const folderWorld = gui.addFolder( 'World' );
			folderWorld.open();

			folderWorld.add( params, 'showAxes' ).name( 'show axes helper' ).onChange( ( value ) => {

				world.helpers.axesHelper.visible = value;

			} );

			folderWorld.add( params, 'showSpawnPoints' ).name( 'show spawn points' ).onChange( ( value ) => {

				world.helpers.spawnHelpers.visible = value;

			} );

			folderWorld.add( params, 'resumeAudioContext' ).name( 'resume audio context ' );
			folderWorld.add( params, 'enableFPSControls' ).name( 'enable FPS controls' );

			// enemy folder

			const folderEnemy = gui.addFolder( 'Enemy' );
			folderEnemy.open();

			folderEnemy.add( params, 'showUUIDHelpers', 1, 30 ).name( 'show UUID helpers' ).onChange( ( value ) => {

				for ( const uuidHelper of world.helpers.uuidHelpers ) {

					uuidHelper.visible = value;

				}

			} );

			folderEnemy.add( params, 'showHitboxes', 1, 30 ).name( 'show hitboxes' ).onChange( ( value ) => {

				for ( const hitboxHelper of world.helpers.hitboxHelpers ) {

					hitboxHelper.visible = value;

				}

			} );

			gui.open();

		}

	}

	/**
	* Shows the FPS interface.
	*
	* @return {UIManager} A reference to this UI manager.
	*/
	showFPSInterface() {

		this.uiElements.crosshairs.classList.remove( 'hidden' );

		return this;

	}

	/**
	* Hides the FPS interface.
	*
	* @return {UIManager} A reference to this UI manager.
	*/
	hideFPSInterface() {

		this.uiElements.crosshairs.classList.add( 'hidden' );

		return this;

	}

	/**
	* Creates the UI-elements for the FPS view.
	*
	* @return {UIManager} A reference to this UI manager.
	*/
	_buildFPSInterface() {

		// crosshairs

		const crosshairsContainer = document.createElement( 'section' );
		crosshairsContainer.id = 'crosshairs';
		crosshairsContainer.classList.add( 'hidden' );

		crosshairsContainer.appendChild( document.createElement( 'div' ) );
		document.body.appendChild( crosshairsContainer );

		this.uiElements.crosshairs = crosshairsContainer;

		return this;

	}

}

export { UIManager };