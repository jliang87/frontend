import {useCallback, useState, useEffect, useRef} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography, Drawer } from '@material-ui/core';
import {ProjectBrowseFilter, ProjectBrowseResults, ProjectCreateWizard} from '../../components/dashboard/project';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import PlusIcon from '../../icons/Plus';
import gtm from '../../lib/gtm';
import axios from '../../lib/axios';
import {updateOpenCreateProjectDrawer, updateProjectDescription, updateProjectDetails} from "../../slices/project";
import { useDispatch, useSelector } from '../../store';

const ProjectBrowse = () => {
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [projects, setProjects] = useState([]);
  const { openCreateProjectDrawer } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const onClose = function () {
    dispatch(updateProjectDetails(
        "",
        [],
        null,
        null
    ));
    dispatch(updateProjectDescription(""));
    dispatch(updateOpenCreateProjectDrawer(false));
  };

  const getProjects = useCallback(async () => {
    try {
      const response = await axios.get('/api/projects/projects');

      if (isMountedRef.current) {
        setProjects(response.data.projects);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <>
      <Helmet>
        <title>Dashboard: Project Browse | Material Kit Pro</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            alignItems="center"
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                See the latest opportunities
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  Dashboard
                </Link>
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard/projects"
                  variant="subtitle2"
                >
                  Projects
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Browse
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
                <Button
                  color="primary"
                  // component={RouterLink}
                  startIcon={<PlusIcon fontSize="small" />}
                  sx={{ m: 1 }}
                  // to="/dashboard/projects/new"
                  variant="contained"
                  onClick={() => dispatch(updateOpenCreateProjectDrawer(true))}
                >
                  New Project
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <ProjectBrowseFilter />
          </Box>
          <Box sx={{ mt: 6 }}>
            <ProjectBrowseResults projects={projects} />
          </Box>
        </Container>
      </Box>
      <Drawer
          anchor="right"
          open={openCreateProjectDrawer}
          onClose={onClose}
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              width: '602px'
            }
          }}
          variant="temporary"
      >
        <ProjectCreateWizard />
      </Drawer>
    </>
  );
};

export default ProjectBrowse;
