export class StationLogModel {
  constructor(
    public id?: any,
    public date?: any,
    public station_status_id?: any,
    public inletPressure?: any,
    public outletPressure?: any,
    public averageFlowRate?: any,
    public operatingUnits?: any,
    public unitsOnStandby?: any,
    public unitsOnMaintenance?: any,
    public powerSource?: any,
    public tankOnDelivery?: any,
    public pumpOver24Hrs?: any,
    public pumpingDaysRemainingT4?: any,
    public operator_id?: any,
    public shift_leader_id?: any,
    public remarks?: any,
  ) {}
}
