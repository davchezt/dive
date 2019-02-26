import { Ray } from '../lib/yuka.module.js';
import { Weapon } from './Weapon.js';
import { WEAPON_STATUS_READY, WEAPON_STATUS_SHOT, WEAPON_STATUS_RELOAD, WEAPON_STATUS_EMPTY } from '../core/Constants.js';
import { CONFIG } from '../core/Config.js';

/**
* Class for representing a blaster.
*
* @author {@link https://github.com/Mugen87|Mugen87}
*/
class Blaster extends Weapon {

	/**
	* Constructs a new blaster with the given values.
	*
	* @param {GameEntity} owner - The owner of this weapon.
	*/
	constructor( owner ) {

		super( owner );

		this.roundsLeft = CONFIG.BLASTER.ROUNDS_LEFT;
		this.roundsPerClip = CONFIG.BLASTER.ROUNDS_PER_CLIP;
		this.ammo = CONFIG.BLASTER.AMMO;
		this.maxAmmo = CONFIG.BLASTER.MAX_AMMO;

		this.shotTime = CONFIG.BLASTER.SHOT_TIME;
		this.reloadTime = CONFIG.BLASTER.RELOAD_TIME;

		// blaster specific properties

		this.muzzleFireTime = CONFIG.BLASTER.MUZZLE_TIME;
		this.endTimeMuzzleFire = Infinity;

		// render specific stuff

		this.muzzle = null;
		this.audios = null;

	}

	/**
	* Update method of this weapon.
	*
	* @param {Number} delta - The time delta value;
	* @return {Blaster} A reference to this weapon.
	*/
	update( delta ) {

		super.update( delta );

		// check reload

		if ( this.currentTime >= this.endTimeReload ) {

			const toReload = this.roundsPerClip - this.roundsLeft;

			if ( this.ammo >= toReload ) {

				this.roundsLeft = this.roundsPerClip;
				this.ammo -= toReload;

			} else {

				this.roundsLeft += this.ammo;
				this.ammo = 0;

			}

			this.status = WEAPON_STATUS_READY;

			this.endTimeReload = Infinity;

		}

		// check muzzle fire

		if ( this.currentTime >= this.endTimeMuzzleFire ) {

			this.muzzle.visible = false;

			this.endTimeMuzzleFire = Infinity;

		}

		// check shoot

		if ( this.currentTime >= this.endTimeShot ) {

			if ( this.roundsLeft === 0 ) {

				this.status = WEAPON_STATUS_EMPTY;

			} else {

				this.status = WEAPON_STATUS_READY;

			}

			this.endTimeShot = Infinity;

		}

		return this;

	}

	/**
	* Reloads the weapon.
	*
	* @return {Blaster} A reference to this weapon.
	*/
	reload() {

		if ( ( this.status === WEAPON_STATUS_READY || this.status === WEAPON_STATUS_EMPTY ) && this.ammo > 0 ) {

			this.status = WEAPON_STATUS_RELOAD;

			const audio = this.audios.get( 'reload' );
			if ( audio.isPlaying === true ) audio.stop();
			audio.play();

			this.endTimeReload = this.currentTime + this.reloadTime;

		}

		return this;

	}

	/**
	* Shoots at the given position.
	*
	* @param {Vector3} targetPosition - The target position.
	* @return {Blaster} A reference to this weapon.
	*/
	shoot( targetPosition ) {

		if ( this.status === WEAPON_STATUS_READY ) {

			this.status = WEAPON_STATUS_SHOT;

			// audio

			const audio = this.audios.get( 'shot' );
			if ( audio.isPlaying === true ) audio.stop();
			audio.play();

			// muzzle fire

			this.muzzle.visible = true;
			this.muzzle.material.rotation = Math.random() * Math.PI;

			this.endTimeMuzzleFire = this.currentTime + this.muzzleFireTime;

			// create bullet

			const ray = new Ray();

			this.getWorldPosition( ray.origin );
			ray.direction.subVectors( targetPosition, ray.origin ).normalize();

			this.owner.world.addBullet( this.owner, ray );

			// adjust ammo

			this.roundsLeft --;

			this.endTimeShot = this.currentTime + this.shotTime;

		}

		return this;

	}

}

export { Blaster };