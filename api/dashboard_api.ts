const fetchDashboardData  = async (): Promise<any> => {
  try {
    const response = await fetch(
      'https://oic-vbcs-oic-vb-axetemueuybx.builder.me-dubai-1.ocp.oraclecloud.com:443/ic/builder/design/LGCSA_BackOffice_Dev/1.0.1/resources/data/InspectionSchedule',

      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic b2ljX2ludGVncmF0aW9uOkxTQ1VzZXJAMTIzNQ=='
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch creationDate:', response.status);
      return null;
    }

    const data = await response.json();
    return data ?? null;
  } catch (error) {
    console.error('Error fetching creationDate:', error);
    return null;
  }
};

export default fetchDashboardData;
