import { NativeModules } from 'react-native';
import { Constants } from './constants';
import { Identify } from './identify';
import { AmplitudeReactNativeModule } from './types';

const AmplitudeReactNative: AmplitudeReactNativeModule =
  NativeModules.AmplitudeReactNative;

export { Identify };

export class Amplitude {
  private static _instances: Record<string, Amplitude>;
  private static _defaultInstanceName = '$default_instance';
  instanceName: string;

  private constructor(instanceName: string) {
    this.instanceName = instanceName;
    this._setLibraryName(Constants.packageSourceName);
    this._setLibraryVersion(Constants.packageVersion);
  }

  static getInstance(
    instanceName: string = this._defaultInstanceName,
  ): Amplitude {
    if (!this._instances) {
      this._instances = {};
    }
    if (!Object.prototype.hasOwnProperty.call(this._instances, instanceName)) {
      this._instances[instanceName] = new Amplitude(instanceName);
    }

    return this._instances[instanceName];
  }

  init(apiKey: string): Promise<boolean> {
    return AmplitudeReactNative.initialize(this.instanceName, apiKey);
  }

  /**
   * Tracks an event. Events are saved locally.
   * Uploads are batched to occur every 30 events or every 30 seconds
   * (whichever comes first), as well as on app close.
   *
   * @param eventType The name of the event you wish to track.
   */
  logEvent(
    eventType: string,
    eventProperties?: Record<string, unknown>,
  ): Promise<boolean> {
    if (eventProperties && Object.keys(eventProperties).length > 0) {
      return AmplitudeReactNative.logEventWithProperties(
        this.instanceName,
        eventType,
        eventProperties,
      );
    }
    return AmplitudeReactNative.logEvent(this.instanceName, eventType);
  }

  /**
   * Enable COPPA (Children's Online Privacy Protection Act) restrictions on
   * IDFA, IDFV, city, IP address and location tracking.
   *
   * This can be used by any customer that does not want to collect IDFA, IDFV,
   * city, IP address and location tracking.
   */
  enableCoppaControl(): Promise<boolean> {
    return AmplitudeReactNative.enableCoppaControl(this.instanceName);
  }

  /**
   * Disable COPPA (Children's Online Privacy Protection Act) restrictions on
   * IDFA, IDFV, city, IP address and location tracking.
   */
  disableCoppaControl(): Promise<boolean> {
    return AmplitudeReactNative.disableCoppaControl(this.instanceName);
  }

  /**
   * Regenerate the DeviceId
   */
  regenerateDeviceId(): Promise<boolean> {
    return AmplitudeReactNative.regenerateDeviceId(this.instanceName);
  }

  /**
   * Enables tracking opt out.
   *
   * If the user wants to opt out of all tracking, use this method to enable
   * opt out for them. Once opt out is enabled, no events will be saved locally
   * or sent to the server.
   *
   * Calling this method again with enabled set to false will turn tracking back on for the user.
   *
   * @param optOut
   */
  setOptOut(optOut: boolean): Promise<boolean> {
    return AmplitudeReactNative.setOptOut(this.instanceName, optOut);
  }

  /**
   * Whether to automatically log start and end session events corresponding to
   * the start and end of a user's session.
   *
   * @param trackSessionEvents
   */
  trackingSessionEvents(trackSessionEvents: boolean): Promise<boolean> {
    return AmplitudeReactNative.trackingSessionEvents(
      this.instanceName,
      trackSessionEvents,
    );
  }

  /**
   * If your app has its own login system that you want to track users with,
   * you can set the userId.
   *
   * @param userId
   */
  setUserId(userId: string): Promise<boolean> {
    return AmplitudeReactNative.setUserId(this.instanceName, userId);
  }

  /**
   * Customize the destination for server url.
   *
   * @param serverUrl
   */
  setServerUrl(serverUrl: string): Promise<boolean> {
    return AmplitudeReactNative.setServerUrl(this.instanceName, serverUrl);
  }

  /**
   * Dynamically adjust server URL
   *
   * @param useDynamicConfig
   */
  setUseDynamicConfig(useDynamicConfig: boolean): Promise<boolean> {
    return AmplitudeReactNative.setUseDynamicConfig(
      this.instanceName,
      useDynamicConfig,
    );
  }

  /**
   * Log revenue data.
   *
   * Note: price is a required field to log revenue events.
   * If quantity is not specified then defaults to 1.
   *
   * @param userProperties
   */
  logRevenue(userProperties: {
    price: number;
    productId?: string;
    quantity?: number;
    revenueType?: string;
    receipt?: string;
    receiptSignature?: string;
    eventProperties?: { [key: string]: any };
  }): Promise<boolean> {
    return AmplitudeReactNative.logRevenueV2(this.instanceName, userProperties);
  }

  /**
   * Send an identify call containing user property operations to Amplitude servers.
   *
   * @param identifyInstance
   */
  identify(identifyInstance: Identify): Promise<boolean> {
    return AmplitudeReactNative.identify(
      this.instanceName,
      identifyInstance.payload,
    );
  }

  /**
   * Adds a user to a group or groups. You need to specify a groupType and groupName(s).
   * @param groupType
   * @param groupName
   */
  setGroup(groupType: string, groupName: string | string[]): Promise<boolean> {
    return AmplitudeReactNative.setGroup(
      this.instanceName,
      groupType,
      groupName,
    );
  }

  /**
   * Set or update properties of particular groups
   *
   * @param groupType
   * @param groupName
   * @param identifyInstance
   */
  groupIdentify(
    groupType: string,
    groupName: string | string[],
    identifyInstance: Identify,
  ): Promise<boolean> {
    return AmplitudeReactNative.groupIdentify(
      this.instanceName,
      groupType,
      groupName,
      identifyInstance.payload,
    );
  }

  /**
   * Adds properties that are tracked on the user level.
   * Note: Property keys must be [String] objects and values must be serializable.
   *
   * @param userProperties
   */
  setUserProperties(userProperties: Record<string, unknown>): Promise<boolean> {
    return AmplitudeReactNative.setUserProperties(
      this.instanceName,
      userProperties,
    );
  }

  /**
   * Clears all properties that are tracked on the user level.
   *
   * Note: This operation is irreversible!!
   */
  clearUserProperties(): Promise<boolean> {
    return AmplitudeReactNative.clearUserProperties(this.instanceName);
  }

  /**
   * Upload all unsent events.
   */
  uploadEvents(): Promise<boolean> {
    return AmplitudeReactNative.uploadEvents(this.instanceName);
  }

  // Private bridging calls
  private _setLibraryName(libraryName: string): Promise<boolean> {
    return AmplitudeReactNative.setLibraryName(this.instanceName, libraryName);
  }

  private _setLibraryVersion(libraryVersion: string): Promise<boolean> {
    return AmplitudeReactNative.setLibraryVersion(
      this.instanceName,
      libraryVersion,
    );
  }
}
