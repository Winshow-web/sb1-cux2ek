const AccountType = {
    basic_disabled: 'basic_disabled', // disabled account
    basic_suspended: 'basic_suspended', // suspended account
    basic: 'basic', // approved/active basic

    client_disabled: 'client_disabled', // disabled account
    client_suspended: 'client_suspended', // suspended account
    client_pending: 'client_pending', // approval request pending
    client_rejected: 'client_rejected', // approval request rejected
    client: 'client', // approved/active client

    driver_disabled: 'driver_disabled', // disabled account
    driver_suspended: 'driver_suspended', // suspended account
    driver_pending: 'driver_pending', // approval request pending
    driver_rejected: 'driver_rejected', // approval request rejected
    driver: 'driver', // approved/active driver

    administrator_disabled: 'administrator_disabled', // disabled account
    administrator_suspended: 'administrator_suspended', // suspended account
    administrator: 'administrator', // approved/active administrator
};

export default AccountType;
